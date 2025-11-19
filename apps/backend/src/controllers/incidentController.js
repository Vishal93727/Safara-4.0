import Incident from '../models/Incident.js';
import { Zone } from '../models/Zone.js';
import { logger } from '../utils/logger.js';
import { createAuditLog } from '../utils/audit.js';
import { sendNotification } from '../utils/notification.js';

export const createIncident = async (req, res) => {
  try {
    const incidentData = req.body;
    const attachments = [];

    // Process uploaded files
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        attachments.push({
          type: file.mimetype.startsWith('image/') ? 'image' : 'document',
          url: file.path,
          publicId: file.filename,
          filename: file.originalname,
          uploadedBy: req.user._id
        });
      });
    }

    // Find zone based on location
    const zone = await Zone.findOne({
      geometry: {
        $geoIntersects: {
          $geometry: {
            type: 'Point',
            coordinates: incidentData.location.coordinates
          }
        }
      }
    });

    const incident = await Incident.create({
      ...incidentData,
      attachments,
      location: {
        ...incidentData.location,
        zone: zone?._id
      },
      reporter: {
        type: 'officer',
        id: req.user._id,
        name: req.user.fullName,
        email: req.user.personalInfo.email
      },
      timeline: [{
        action: 'incident_created',
        description: 'Incident reported',
        performedBy: req.user._id
      }]
    });

    await createAuditLog({
      user: req.user._id,
      action: 'INCIDENT_CREATE',
      description: `Created incident: ${incident.incidentId}`,
      category: 'incident_management',
      metadata: { incidentId: incident.incidentId, type: incident.type }
    });

    // Send real-time notification
    await sendNotification({
      type: 'incident_created',
      data: incident,
      recipients: ['admin', 'supervisor']
    });

    res.status(201).json({
      status: 'success',
      message: 'Incident created successfully',
      data: { incident }
    });

  } catch (error) {
    logger.error('Create incident error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create incident'
    });
  }
};

export const getIncidents = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      type,
      priority,
      startDate,
      endDate,
      zone,
      assignedTo
    } = req.query;

    const filter = {};

    if (status) filter.status = status;
    if (type) filter.type = type;
    if (priority) filter.priority = priority;
    if (zone) filter['location.zone'] = zone;
    if (assignedTo) filter['assignedTo.officer'] = assignedTo;

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    // Role-based filtering
    if (req.user.accountDetails.role === 'officer') {
      filter.$or = [
        { 'reporter.id': req.user._id },
        { 'assignedTo.officer': req.user._id }
      ];
    }

    const incidents = await Incident.find(filter)
      .populate('assignedTo.officer', 'personalInfo.firstName personalInfo.lastName')
      .populate('location.zone', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Incident.countDocuments(filter);

    res.json({
      status: 'success',
      data: {
        incidents,
        pagination: {
          page: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });

  } catch (error) {
    logger.error('Get incidents error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch incidents'
    });
  }
};

export const getIncident = async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id)
      .populate('assignedTo.officer', 'personalInfo.firstName personalInfo.lastName accountDetails.role')
      .populate('location.zone', 'name description')
      .populate('timeline.performedBy', 'personalInfo.firstName personalInfo.lastName')
      .populate('resolution.resolvedBy', 'personalInfo.firstName personalInfo.lastName');

    if (!incident) {
      return res.status(404).json({
        status: 'error',
        message: 'Incident not found'
      });
    }

    // Check access permissions
    if (req.user.accountDetails.role === 'officer' && 
        incident.reporter.id.toString() !== req.user._id.toString() &&
        incident.assignedTo.officer?.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied'
      });
    }

    res.json({
      status: 'success',
      data: { incident }
    });

  } catch (error) {
    logger.error('Get incident error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch incident'
    });
  }
};

export const updateIncident = async (req, res) => {
  try {
    const updates = req.body;
    const incident = await Incident.findById(req.params.id);

    if (!incident) {
      return res.status(404).json({
        status: 'error',
        message: 'Incident not found'
      });
    }

    // Check permissions
    if (req.user.accountDetails.role === 'officer' && 
        incident.assignedTo.officer?.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'You can only update incidents assigned to you'
      });
    }

    // Update incident
    Object.keys(updates).forEach(key => {
      incident[key] = updates[key];
    });

    // Add timeline entry
    incident.timeline.push({
      action: 'incident_updated',
      description: 'Incident details updated',
      performedBy: req.user._id
    });

    await incident.save();

    await createAuditLog({
      user: req.user._id,
      action: 'INCIDENT_UPDATE',
      description: `Updated incident: ${incident.incidentId}`,
      category: 'incident_management',
      metadata: { incidentId: incident.incidentId, changes: Object.keys(updates) }
    });

    res.json({
      status: 'success',
      message: 'Incident updated successfully',
      data: { incident }
    });

  } catch (error) {
    logger.error('Update incident error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update incident'
    });
  }
};

export const deleteIncident = async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id);

    if (!incident) {
      return res.status(404).json({
        status: 'error',
        message: 'Incident not found'
      });
    }

    await incident.deleteOne();

    await createAuditLog({
      user: req.user._id,
      action: 'INCIDENT_DELETE',
      description: `Deleted incident: ${incident.incidentId}`,
      category: 'incident_management',
      metadata: { incidentId: incident.incidentId }
    });

    res.json({
      status: 'success',
      message: 'Incident deleted successfully'
    });

  } catch (error) {
    logger.error('Delete incident error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete incident'
    });
  }
};

export const assignIncident = async (req, res) => {
  try {
    const { officerId, team } = req.body;
    const incident = await Incident.findById(req.params.id);

    if (!incident) {
      return res.status(404).json({
        status: 'error',
        message: 'Incident not found'
      });
    }

    incident.assignedTo = {
      officer: officerId,
      team,
      assignedAt: new Date(),
      assignedBy: req.user._id
    };

    incident.status = 'in_progress';

    incident.timeline.push({
      action: 'incident_assigned',
      description: `Incident assigned to officer`,
      performedBy: req.user._id
    });

    await incident.save();

    await createAuditLog({
      user: req.user._id,
      action: 'INCIDENT_ASSIGN',
      description: `Assigned incident: ${incident.incidentId}`,
      category: 'incident_management',
      metadata: { incidentId: incident.incidentId, assignedTo: officerId }
    });

    // Send notification to assigned officer
    await sendNotification({
      type: 'incident_assigned',
      data: incident,
      recipients: [officerId]
    });

    res.json({
      status: 'success',
      message: 'Incident assigned successfully',
      data: { incident }
    });

  } catch (error) {
    logger.error('Assign incident error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to assign incident'
    });
  }
};

export const resolveIncident = async (req, res) => {
  try {
    const { resolution, followUpRequired, followUpDate } = req.body;
    const incident = await Incident.findById(req.params.id);

    if (!incident) {
      return res.status(404).json({
        status: 'error',
        message: 'Incident not found'
      });
    }

    incident.status = 'resolved';
    incident.resolution = {
      resolvedAt: new Date(),
      resolvedBy: req.user._id,
      resolution,
      followUpRequired: followUpRequired || false,
      followUpDate: followUpDate ? new Date(followUpDate) : undefined
    };

    incident.timeline.push({
      action: 'incident_resolved',
      description: 'Incident marked as resolved',
      performedBy: req.user._id
    });

    await incident.save();

    await createAuditLog({
      user: req.user._id,
      action: 'INCIDENT_RESOLVE',
      description: `Resolved incident: ${incident.incidentId}`,
      category: 'incident_management',
      metadata: { incidentId: incident.incidentId }
    });

    res.json({
      status: 'success',
      message: 'Incident resolved successfully',
      data: { incident }
    });

  } catch (error) {
    logger.error('Resolve incident error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to resolve incident'
    });
  }
};

export const getIncidentStats = async (req, res) => {
  try {
    const stats = await Incident.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          open: { $sum: { $cond: [{ $eq: ['$status', 'open'] }, 1, 0] } },
          inProgress: { $sum: { $cond: [{ $eq: ['$status', 'in_progress'] }, 1, 0] } },
          resolved: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } },
          critical: { $sum: { $cond: [{ $eq: ['$priority', 'critical'] }, 1, 0] } },
          high: { $sum: { $cond: [{ $eq: ['$priority', 'high'] }, 1, 0] } },
          avgResponseTime: { $avg: '$duration' }
        }
      }
    ]);

    const typeStats = await Incident.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);

    const recentIncidents = await Incident.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('incidentId title type priority status createdAt');

    res.json({
      status: 'success',
      data: {
        overview: stats[0] || {
          total: 0, open: 0, inProgress: 0, resolved: 0, 
          critical: 0, high: 0, avgResponseTime: 0
        },
        typeDistribution: typeStats,
        recentIncidents
      }
    });

  } catch (error) {
    logger.error('Get incident stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch incident statistics'
    });
  }
};

export const getNearbyIncidents = async (req, res) => {
  try {
    const { latitude, longitude, radius = 5000 } = req.query; // radius in meters

    if (!latitude || !longitude) {
      return res.status(400).json({
        status: 'error',
        message: 'Latitude and longitude are required'
      });
    }

    const incidents = await Incident.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseInt(radius)
        }
      },
      status: { $ne: 'closed' }
    }).limit(20);

    res.json({
      status: 'success',
      data: { incidents }
    });

  } catch (error) {
    logger.error('Get nearby incidents error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch nearby incidents'
    });
  }
};

export const getIncidentTimeline = async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id)
      .populate('timeline.performedBy', 'personalInfo.firstName personalInfo.lastName')
      .select('timeline');

    if (!incident) {
      return res.status(404).json({
        status: 'error',
        message: 'Incident not found'
      });
    }

    res.json({
      status: 'success',
      data: { timeline: incident.timeline }
    });

  } catch (error) {
    logger.error('Get incident timeline error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch incident timeline'
    });
  }
};

export const addIncidentUpdate = async (req, res) => {
  try {
    const { description } = req.body;
    const incident = await Incident.findById(req.params.id);

    if (!incident) {
      return res.status(404).json({
        status: 'error',
        message: 'Incident not found'
      });
    }

    const attachments = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach(file => {
        attachments.push(file.path);
      });
    }

    incident.timeline.push({
      action: 'incident_update',
      description,
      performedBy: req.user._id,
      attachments
    });

    await incident.save();

    res.json({
      status: 'success',
      message: 'Incident update added successfully',
      data: { timeline: incident.timeline }
    });

  } catch (error) {
    logger.error('Add incident update error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to add incident update'
    });
  }
};