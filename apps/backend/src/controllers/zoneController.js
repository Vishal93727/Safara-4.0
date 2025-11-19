import { Zone } from '../models/Zone.js';
import Incident from '../models/Incident.js';
import { User } from '../models/User.js';
import { logger } from '../utils/logger.js';
import { createAuditLog } from '../utils/audit.js';

export const createZone = async (req, res) => {
  try {
    const zoneData = req.body;
    
    // Generate zone code if not provided
    if (!zoneData.code) {
      const typePrefix = zoneData.type.toUpperCase().substring(0, 3);
      const count = await Zone.countDocuments({ type: zoneData.type });
      zoneData.code = `${typePrefix}-${String(count + 1).padStart(3, '0')}`;
    }

    const zone = await Zone.create({
      ...zoneData,
      createdBy: req.user._id
    });

    await createAuditLog({
      user: req.user._id,
      action: 'ZONE_CREATE',
      description: `Created zone: ${zone.name}`,
      category: 'zone_management',
      metadata: { zoneId: zone._id, zoneCode: zone.code }
    });

    res.status(201).json({
      status: 'success',
      message: 'Zone created successfully',
      data: { zone }
    });

  } catch (error) {
    logger.error('Create zone error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create zone'
    });
  }
};

export const getZones = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      type,
      status,
      riskLevel,
      search
    } = req.query;

    const filter = {};
    
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (riskLevel) filter['properties.riskLevel'] = riskLevel;
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const zones = await Zone.find(filter)
      .populate('assignedOfficers.officer', 'personalInfo.firstName personalInfo.lastName')
      .populate('createdBy', 'personalInfo.firstName personalInfo.lastName')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Zone.countDocuments(filter);

    res.json({
      status: 'success',
      data: {
        zones,
        pagination: {
          page: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });

  } catch (error) {
    logger.error('Get zones error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch zones'
    });
  }
};

export const getZone = async (req, res) => {
  try {
    const zone = await Zone.findById(req.params.id)
      .populate('assignedOfficers.officer', 'personalInfo.firstName personalInfo.lastName accountDetails.role')
      .populate('createdBy', 'personalInfo.firstName personalInfo.lastName')
      .populate('updatedBy', 'personalInfo.firstName personalInfo.lastName');

    if (!zone) {
      return res.status(404).json({
        status: 'error',
        message: 'Zone not found'
      });
    }

    res.json({
      status: 'success',
      data: { zone }
    });

  } catch (error) {
    logger.error('Get zone error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch zone'
    });
  }
};

export const updateZone = async (req, res) => {
  try {
    const updates = req.body;
    const zone = await Zone.findById(req.params.id);

    if (!zone) {
      return res.status(404).json({
        status: 'error',
        message: 'Zone not found'
      });
    }

    Object.keys(updates).forEach(key => {
      zone[key] = updates[key];
    });

    zone.updatedBy = req.user._id;
    await zone.save();

    await createAuditLog({
      user: req.user._id,
      action: 'ZONE_UPDATE',
      description: `Updated zone: ${zone.name}`,
      category: 'zone_management',
      metadata: { 
        zoneId: zone._id, 
        zoneCode: zone.code,
        updatedFields: Object.keys(updates)
      }
    });

    res.json({
      status: 'success',
      message: 'Zone updated successfully',
      data: { zone }
    });

  } catch (error) {
    logger.error('Update zone error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update zone'
    });
  }
};

export const deleteZone = async (req, res) => {
  try {
    const zone = await Zone.findById(req.params.id);

    if (!zone) {
      return res.status(404).json({
        status: 'error',
        message: 'Zone not found'
      });
    }

    // Check if zone has active incidents
    const activeIncidents = await Incident.countDocuments({
      'location.zone': zone._id,
      status: { $in: ['open', 'in_progress'] }
    });

    if (activeIncidents > 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Cannot delete zone with active incidents'
      });
    }

    await zone.deleteOne();

    await createAuditLog({
      user: req.user._id,
      action: 'ZONE_DELETE',
      description: `Deleted zone: ${zone.name}`,
      category: 'zone_management',
      metadata: { zoneId: zone._id, zoneCode: zone.code }
    });

    res.json({
      status: 'success',
      message: 'Zone deleted successfully'
    });

  } catch (error) {
    logger.error('Delete zone error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete zone'
    });
  }
};

export const getZoneStats = async (req, res) => {
  try {
    const stats = await Zone.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          active: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
          inactive: { $sum: { $cond: [{ $eq: ['$status', 'inactive'] }, 1, 0] } },
          maintenance: { $sum: { $cond: [{ $eq: ['$status', 'maintenance'] }, 1, 0] } },
          lowRisk: { $sum: { $cond: [{ $eq: ['$properties.riskLevel', 'low'] }, 1, 0] } },
          highRisk: { $sum: { $cond: [{ $eq: ['$properties.riskLevel', 'high'] }, 1, 0] } },
          criticalRisk: { $sum: { $cond: [{ $eq: ['$properties.riskLevel', 'critical'] }, 1, 0] } },
          totalCapacity: { $sum: '$properties.capacity' },
          totalOccupancy: { $sum: '$properties.currentOccupancy' },
          avgSafetyScore: { $avg: '$statistics.safetyScore' }
        }
      }
    ]);

    const typeStats = await Zone.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          avgSafetyScore: { $avg: '$statistics.safetyScore' }
        }
      }
    ]);

    const alertStats = await Zone.aggregate([
      { $unwind: '$alerts' },
      { $match: { 'alerts.isActive': true } },
      {
        $group: {
          _id: '$alerts.severity',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      status: 'success',
      data: {
        overview: stats[0] || {
          total: 0, active: 0, inactive: 0, maintenance: 0,
          lowRisk: 0, highRisk: 0, criticalRisk: 0,
          totalCapacity: 0, totalOccupancy: 0, avgSafetyScore: 100
        },
        typeDistribution: typeStats,
        activeAlerts: alertStats
      }
    });

  } catch (error) {
    logger.error('Get zone stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch zone statistics'
    });
  }
};

export const getZoneIncidents = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const zoneId = req.params.id;

    const filter = { 'location.zone': zoneId };
    if (status) filter.status = status;

    const incidents = await Incident.find(filter)
      .populate('assignedTo.officer', 'personalInfo.firstName personalInfo.lastName')
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
    logger.error('Get zone incidents error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch zone incidents'
    });
  }
};

export const getZoneTourists = async (req, res) => {
  try {
    // This would integrate with a tourist tracking system
    // For now, return mock data
    res.json({
      status: 'success',
      message: 'Tourist tracking integration not implemented yet',
      data: {
        currentTourists: 0,
        capacity: 0,
        occupancyRate: 0
      }
    });

  } catch (error) {
    logger.error('Get zone tourists error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch zone tourist data'
    });
  }
};