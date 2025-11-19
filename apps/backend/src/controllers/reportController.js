// src/controllers/reportController.js
import { Parser as Json2CsvParser } from 'json2csv';
import Incident from '../models/Incident.js';
import { User } from '../models/User.js';
import {Zone} from '../models/Zone.js';
import {logger} from '../utils/logger.js';

/**
 * Download report as JSON or CSV
 */
export const downloadReport = async (req, res) => {
  try {
    const { reportType, format = 'json' } = req.query;
    let reportData;

    switch (reportType) {
      case 'dashboard':
        reportData = await generateDashboardReport(req);
        break;
      case 'incidents':
        reportData = await generateIncidentReport(req);
        break;
      case 'users':
        reportData = await generateUserReport(req);
        break;
      case 'zones':
        reportData = await generateZoneReport(req);
        break;
      default:
        return res.status(400).json({ status: 'error', message: 'Invalid report type' });
    }

    if (format === 'json') {
      return res.json({ status: 'success', data: reportData });
    } else if (format === 'csv') {
      const parser = new Json2CsvParser();
      const csv = parser.parse(reportData);
      res.header('Content-Type', 'text/csv');
      res.attachment(`${reportType}-report-${Date.now()}.csv`);
      return res.send(csv);
    } else {
      return res.status(415).json({ status: 'error', message: `Format "${format}" not supported` });
    }
  } catch (error) {
    logger.error('Download report error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to download report' });
  }
};

/**
 * Dashboard report generator
 */
export const generateDashboardReport = async (req) => {
  const { timeRange = '7d' } = req.query;
  const now = new Date();
  const startDate = new Date();

  switch (timeRange) {
    case '1d': startDate.setDate(now.getDate() - 1); break;
    case '7d': startDate.setDate(now.getDate() - 7); break;
    case '30d': startDate.setDate(now.getDate() - 30); break;
    case '90d': startDate.setDate(now.getDate() - 90); break;
    default: startDate.setDate(now.getDate() - 7);
  }

  const incidentStats = await Incident.aggregate([
    { $match: { createdAt: { $gte: startDate } } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        critical: { $sum: { $cond: [{ $eq: ['$priority', 'critical'] }, 1, 0] } },
        high: { $sum: { $cond: [{ $eq: ['$priority', 'high'] }, 1, 0] } },
        resolved: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } },
        avgResponseTime: { $avg: '$duration' }
      }
    }
  ]);

  const dailyTrend = await Incident.aggregate([
    { $match: { createdAt: { $gte: startDate } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 },
        critical: { $sum: { $cond: [{ $eq: ['$priority', 'critical'] }, 1, 0] } }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  const zoneStats = await Zone.aggregate([
    {
      $lookup: {
        from: 'incidents',
        localField: '_id',
        foreignField: 'location.zone',
        as: 'incidents'
      }
    },
    {
      $project: {
        name: 1,
        type: 1,
        incidentCount: { $size: '$incidents' },
        safetyScore: '$statistics.safetyScore'
      }
    },
    { $sort: { incidentCount: -1 } },
    { $limit: 10 }
  ]);

  const userStats = await User.aggregate([
    {
      $group: {
        _id: '$accountDetails.role',
        active: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
        total: { $sum: 1 }
      }
    }
  ]);

  return {
    metadata: {
      generatedAt: new Date().toISOString(),
      timeRange,
      startDate: startDate.toISOString(),
      endDate: now.toISOString(),
      generatedBy: req.user.fullName
    },
    incidents: {
      overview: incidentStats[0] || { total: 0, critical: 0, high: 0, resolved: 0, avgResponseTime: 0 },
      dailyTrend
    },
    zones: { topIncidentZones: zoneStats },
    users: { roleDistribution: userStats }
  };
};

/**
 * Incident report generator
 */
export const generateIncidentReport = async (req) => {
  const { startDate, endDate, type, priority, status, zone } = req.query;
  const filter = {};

  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate);
    if (endDate) filter.createdAt.$lte = new Date(endDate);
  }
  if (type) filter.type = type;
  if (priority) filter.priority = priority;
  if (status) filter.status = status;
  if (zone) filter['location.zone'] = zone;

  const incidents = await Incident.find(filter)
    .populate('assignedTo', 'personalInfo.firstName personalInfo.lastName')
    .populate('location.zone', 'name code')
    .populate('reporter.id', 'personalInfo.firstName personalInfo.lastName')
    .sort({ createdAt: -1 });

  const summary = await Incident.aggregate([
    { $match: filter },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        byType: { $push: { type: '$type', priority: '$priority', status: '$status' } }
      }
    }
  ]);

  return {
    metadata: {
      generatedAt: new Date().toISOString(),
      filters: { startDate, endDate, type, priority, status, zone },
      totalRecords: incidents.length,
      generatedBy: req.user.fullName
    },
    summary: summary[0] || { total: 0, byType: [] },
    incidents
  };
};

/**
 * User report generator
 */
export const generateUserReport = async (req) => {
  const { role, status, department, startDate, endDate } = req.query;
  const filter = {};

  if (role) filter['accountDetails.role'] = role;
  if (status) filter.status = status;
  if (department) filter['departmentInfo.department'] = department;
  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) filter.createdAt.$gte = new Date(startDate);
    if (endDate) filter.createdAt.$lte = new Date(endDate);
  }

  const users = await User.find(filter)
    .select('-accountDetails.password')
    .sort({ createdAt: -1 });

  const stats = await User.aggregate([
    { $match: filter },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        active: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
        pending: { $sum: { $cond: [{ $eq: ['$registrationStatus.status', 'pending'] }, 1, 0] } },
        approved: { $sum: { $cond: [{ $eq: ['$registrationStatus.status', 'approved'] }, 1, 0] } }
      }
    }
  ]);

  return {
    metadata: {
      generatedAt: new Date().toISOString(),
      filters: { role, status, department, startDate, endDate },
      totalRecords: users.length,
      generatedBy: req.user.fullName
    },
    summary: stats[0] || { total: 0, active: 0, pending: 0, approved: 0 },
    users
  };
};

/**
 * Zone report generator
 */
export const generateZoneReport = async (req) => {
  const { type, status, riskLevel } = req.query;
  const filter = {};

  if (type) filter.type = type;
  if (status) filter.status = status;
  if (riskLevel) filter['properties.riskLevel'] = riskLevel;

  const zones = await Zone.find(filter)
    .populate('assignedOfficers.officer', 'personalInfo.firstName personalInfo.lastName')
    .sort({ 'statistics.safetyScore': 1 });

  const stats = await Zone.aggregate([
    { $match: filter },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        active: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
        inactive: { $sum: { $cond: [{ $eq: ['$status', 'inactive'] }, 1, 0] } },
        byType: { $push: '$type' },
        avgSafetyScore: { $avg: '$statistics.safetyScore' }
      }
    }
  ]);

  return {
    metadata: {
      generatedAt: new Date().toISOString(),
      filters: { type, status, riskLevel },
      totalRecords: zones.length,
      generatedBy: req.user.fullName
    },
    summary: stats[0] || { total: 0, active: 0, inactive: 0, byType: [], avgSafetyScore: 0 },
    zones
  };
};

/**
 * Get report history (optional, if you store generated reports)
 */
export const getReportHistory = async (req, res) => {
  try {
    // Example: Assuming you have a ReportHistory model
    const history = await ReportHistory.find({ generatedBy: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json({ status: 'success', data: history });
  } catch (error) {
    logger.error('Get report history error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to fetch report history' });
  }
};

/**
 * Schedule report (optional)
 */
export const scheduleReport = async (req, res) => {
  try {
    const { reportType, format, scheduleTime, recipients } = req.body;

    // Example: Using a hypothetical SchedulerService
    await SchedulerService.schedule({
      reportType,
      format,
      scheduleTime,
      recipients,
      generatedBy: req.user._id
    });

    res.json({ status: 'success', message: 'Report scheduled successfully' });
  } catch (error) {
    logger.error('Schedule report error:', error);
    res.status(500).json({ status: 'error', message: 'Failed to schedule report' });
  }
};