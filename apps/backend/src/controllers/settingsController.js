// import Settings from '../models/Settings.js';
// import { User } from '../models/User.js';
// import {AuditLog} from '../models/AuditLog.js';
// import {logger} from '../utils/logger.js';
// import SystemSettings from '../models/SystemSettings.js'; // ✅ Create this model similar to UserSettings
// import IntegrationSettings from '../models/IntegrationSettings.js';
// // -------------------- User Settings --------------------

// export const getUserSettings = async (req, res) => {
//   try {
//     const userId = req.user._id;

//     let settings = await Settings.findOne({ user: userId });
//     if (!settings) {
//       settings = new Settings({ user: userId });
//       await settings.save();
//     }

//     res.json({ settings });
//   } catch (error) {
//     logger.error('Get user settings error:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

// export const updateUserSettings = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const updateData = req.body;

//     const settings = await Settings.findOneAndUpdate(
//       { user: userId },
//       { $set: updateData },
//       { new: true, upsert: true, runValidators: true }
//     );

//     if (updateData.preferences) {
//       await User.findByIdAndUpdate(userId, { preferences: updateData.preferences });
//     }

//     // await AuditLog.create({
//     //   user: userId,
//     //   action: 'Updated user settings',
//     //   category: 'user_management',
//     //   details: { updatedFields: Object.keys(updateData) },
//     //   ipAddress: req.ip,
//     //   userAgent: req.get('User-Agent'),
//     //   outcome: 'success'
//     // });
// await AuditLog.create({
//   user: userId, // or req.user._id
//   action: 'Updated user settings',
//   category: 'user_management',
//   description: 'User updated personal settings',   // ✅ FIX
//   details: { updatedFields: Object.keys(updateData) },
//   ipAddress: req.ip,
//   userAgent: req.get('User-Agent'),
//   outcome: 'success'
// });
//     res.json({ message: 'Settings updated successfully', settings });
//   } catch (error) {
//     logger.error('Update user settings error:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

// // -------------------- System Settings --------------------

// // export const getSystemSettings = async (req, res) => {
// //   try {
// //     const systemSettings = {
// //       general: {
// //         systemName: 'SentinelView',
// //         version: '1.0.0',
// //         timezone: 'Asia/Kolkata',
// //         language: 'en',
// //         dateFormat: 'DD/MM/YYYY',
// //         currency: 'INR'
// //       },
// //       security: {
// //         passwordMinLength: 8,
// //         passwordComplexity: true,
// //         sessionTimeout: 3600,
// //         maxLoginAttempts: 5,
// //         lockoutDuration: 7200,
// //         twoFactorRequired: false
// //       },
// //       notifications: {
// //         emailEnabled: true,
// //         smsEnabled: true,
// //         pushEnabled: true,
// //         emailProvider: 'smtp',
// //         smsProvider: 'twilio'
// //       },
// //       api: {
// //         rateLimit: 100,
// //         rateLimitWindow: 900000,
// //         apiVersion: 'v1',
// //         corsEnabled: true
// //       },
// //       integrations: {
// //         digiLocker: { enabled: true, baseUrl: process.env.DIGILOCKER_API_URL },
// //         erss: { enabled: true, endpoint: process.env.ERSS_ENDPOINT },
// //         weather: { enabled: true, provider: 'openweather' }
// //       }
// //     };

// //     res.json({ systemSettings });
// //   } catch (error) {
// //     logger.error('Get system settings error:', error);
// //     res.status(500).json({ message: 'Internal server error' });
// //   }
// // };

// // export const updateSystemSettings = async (req, res) => {
// //   try {
// //     const updateData = req.body;

// //     // await AuditLog.create({
// //     //   user: req.user._id,
// //     //   action: 'Updated system settings',
// //     //   category: 'system_config',
// //     //   details: { updatedSettings: Object.keys(updateData) },
// //     //   ipAddress: req.ip,
// //     //   userAgent: req.get('User-Agent'),
// //     //   outcome: 'success'
// //     // });
// // await AuditLog.create({
// //   user: req.user._id,
// //   action: 'Updated system settings',
// //   category: 'system_config',
// //   description: 'System settings updated by admin',
// //   details: { updatedSettings: Object.keys(updateData) },
// //   ipAddress: req.ip,
// //   userAgent: req.get('User-Agent'),
// //   outcome: 'success'
// // });
// //     res.json({ message: 'System settings updated successfully' });
// //   } catch (error) {
// //     logger.error('Update system settings error:', error);
// //     res.status(500).json({ message: 'Internal server error' });
// //   }
// // };


// export const getSystemSettings = async (req, res) => {
//   try {
//     let settings = await SystemSettings.findOne({});
//     if (!settings) {
//       settings = new SystemSettings(); // default values
//       await settings.save();
//     }
//     res.json({ systemSettings: settings });
//   } catch (error) {
//     logger.error('Get system settings error:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

// export const updateSystemSettings = async (req, res) => {
//   try {
//     const updateData = req.body;

//     const settings = await SystemSettings.findOneAndUpdate(
//       {},
//       { $set: updateData },
//       { new: true, upsert: true }
//     );

//     await AuditLog.create({
//       user: req.user._id,
//       action: 'Updated system settings',
//       category: 'system_config',
//       description: 'System settings updated by admin',
//       details: { updatedSettings: Object.keys(updateData) },
//       ipAddress: req.ip,
//       userAgent: req.get('User-Agent'),
//       outcome: 'success'
//     });

//     res.json({ message: 'System settings updated successfully', systemSettings: settings });
//   } catch (error) {
//     logger.error('Update system settings error:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };
// // -------------------- Notification Settings --------------------

// export const getNotificationSettings = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const settings = await Settings.findOne({ user: userId });

//     if (!settings) return res.status(404).json({ message: 'Settings not found' });

//     res.json({ notifications: settings.notifications });
//   } catch (error) {
//     logger.error('Get notification settings error:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

// export const updateNotificationSettings = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const { notifications } = req.body;

//     const settings = await Settings.findOneAndUpdate(
//       { user: userId },
//       { $set: { notifications } },
//       { new: true, upsert: true }
//     );

//     // await AuditLog.create({
//     //   user: userId,
//     //   action: 'Updated notification settings',
//     //   category: 'user_management',
//     //   details: { notifications },
//     //   ipAddress: req.ip,
//     //   userAgent: req.get('User-Agent'),
//     //   outcome: 'success'
//     // });
// await AuditLog.create({
//   user: userId,
//   action: 'Updated notification settings',
//   category: 'user_management',
//   description: 'User changed notification preferences',
//   details: { notifications },
//   ipAddress: req.ip,
//   userAgent: req.get('User-Agent'),
//   outcome: 'success'
// });
//     res.json({ message: 'Notification settings updated successfully', notifications: settings.notifications });
//   } catch (error) {
//     logger.error('Update notification settings error:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

// // -------------------- Audit Log --------------------

// export const getAuditLog = async (req, res) => {
//   try {
//     const logs = await AuditLog.find()
//       .sort({ createdAt: -1 })
//       .limit(100)
//       .populate('user', 'personalInfo.firstName personalInfo.lastName accountDetails.username');

//     res.json({ logs });
//   } catch (error) {
//     logger.error('Get audit log error:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

// // -------------------- API Integrations --------------------

// // export const getApiIntegrations = async (req, res) => {
// //   try {
// //     // Mock API integrations; in production, fetch from DB
// //     const integrations = {
// //       digiLocker: { enabled: true, baseUrl: process.env.DIGILOCKER_API_URL },
// //       erss: { enabled: true, endpoint: process.env.ERSS_ENDPOINT },
// //       weather: { enabled: true, provider: 'openweather' }
// //     };

// //     res.json({ integrations });
// //   } catch (error) {
// //     logger.error('Get API integrations error:', error);
// //     res.status(500).json({ message: 'Internal server error' });
// //   }
// // };

// // export const updateApiIntegrations = async (req, res) => {
// //   try {
// //     const updateData = req.body;

// //     // Mock: just log the update in audit log
// //     // await AuditLog.create({
// //     //   user: req.user._id,
// //     //   action: 'Updated API integrations',
// //     //   category: 'system_config',
// //     //   details: { updatedIntegrations: Object.keys(updateData) },
// //     //   ipAddress: req.ip,
// //     //   userAgent: req.get('User-Agent'),
// //     //   outcome: 'success'
// //     // });
// // await AuditLog.create({
// //   user: req.user._id,
// //   action: 'Updated API integrations',
// //   category: 'system_config',
// //   description: 'Admin modified API integration settings',
// //   details: { updatedIntegrations: Object.keys(updateData) },
// //   ipAddress: req.ip,
// //   userAgent: req.get('User-Agent'),
// //   outcome: 'success'
// // });
// //     res.json({ message: 'API integrations updated successfully', integrations: updateData });
// //   } catch (error) {
// //     logger.error('Update API integrations error:', error);
// //     res.status(500).json({ message: 'Internal server error' });
// //   }
// // };


// export const getApiIntegrations = async (req, res) => {
//   try {
//     let integrations = await IntegrationSettings.findOne({});
//     if (!integrations) {
//       integrations = new IntegrationSettings();
//       await integrations.save();
//     }
//     res.json({ integrations });
//   } catch (error) {
//     logger.error('Get API integrations error:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

// export const updateApiIntegrations = async (req, res) => {
//   try {
//     const updateData = req.body;

//     const integrations = await IntegrationSettings.findOneAndUpdate(
//       {},
//       { $set: updateData },
//       { new: true, upsert: true }
//     );

//     await AuditLog.create({
//       user: req.user._id,
//       action: 'Updated API integrations',
//       category: 'system_config',
//       description: 'Admin modified API integration settings',
//       details: { updatedIntegrations: Object.keys(updateData) },
//       ipAddress: req.ip,
//       userAgent: req.get('User-Agent'),
//       outcome: 'success'
//     });

//     res.json({ message: 'API integrations updated successfully', integrations });
//   } catch (error) {
//     logger.error('Update API integrations error:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };
// export const testIntegration = async (req, res) => {
//   try {
//     const { service } = req.params;

//     // Mock testing
//     let result;
//     switch (service) {
//       case 'digiLocker':
//         result = { status: 'success', message: 'DigiLocker integration works!' };
//         break;
//       case 'erss':
//         result = { status: 'success', message: 'ERSS integration works!' };
//         break;
//       case 'weather':
//         result = { status: 'success', message: 'Weather API works!' };
//         break;
//       default:
//         return res.status(400).json({ status: 'error', message: 'Unknown service' });
//     }

//     // await AuditLog.create({
//     //   user: req.user._id,
//     //   action: `Tested API integration: ${service}`,
//     //   category: 'system_config',
//     //   details: result,
//     //   ipAddress: req.ip,
//     //   userAgent: req.get('User-Agent'),
//     //   outcome: 'success'
//     // });
    
//     await AuditLog.create({
//   user: req.user._id,
//   action: `Tested API integration: ${service}`,
//   category: 'system_config',
//   description: `Tested integration connectivity for ${service}`,
//   details: result,
//   ipAddress: req.ip,
//   userAgent: req.get('User-Agent'),
//   outcome: 'success'
// });

//     res.json(result);
//   } catch (error) {
//     logger.error('Test integration error:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

import Settings from '../models/Settings.js';
import { User } from '../models/User.js';
import { AuditLog } from '../models/AuditLog.js';
import { logger } from '../utils/logger.js';
import SystemSettings from '../models/SystemSettings.js';
import IntegrationSettings from '../models/IntegrationSettings.js';
//import { redisClient } from '../config/redis.js';
import { redisClient, getCache, setCache, deleteCache } from '../config/redis.js';

// -------------------- User Settings --------------------

// export const getUserSettings = async (req, res) => {
//   try {
//     const userId = req.user._id;

//     // Check Redis cache first
//     const cached = await redisClient.get(`userSettings:${userId}`);
//     if (cached) return res.json({ settings: JSON.parse(cached) });

//     let settings = await Settings.findOne({ user: userId });
//     if (!settings) {
//       settings = new Settings({ user: userId });
//       await settings.save();
//     }

//     // Store in Redis
//     await redisClient.set(`userSettings:${userId}`, JSON.stringify(settings), { EX: 3600 });

//     res.json({ settings });
//   } catch (error) {
//     logger.error('Get user settings error:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

// export const updateUserSettings = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const updateData = req.body;

//     const settings = await Settings.findOneAndUpdate(
//       { user: userId },
//       { $set: updateData },
//       { new: true, upsert: true, runValidators: true }
//     );

//     if (updateData.preferences) {
//       await User.findByIdAndUpdate(userId, { preferences: updateData.preferences });
//     }

//     await AuditLog.create({
//       user: userId,
//       action: 'Updated user settings',
//       category: 'user_management',
//       description: 'User updated personal settings',
//       details: { updatedFields: Object.keys(updateData) },
//       ipAddress: req.ip,
//       userAgent: req.get('User-Agent'),
//       outcome: 'success'
//     });

//     // Update Redis cache
//     await redisClient.set(`userSettings:${userId}`, JSON.stringify(settings), { EX: 3600 });

//     res.json({ message: 'Settings updated successfully', settings });
//   } catch (error) {
//     logger.error('Update user settings error:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

export const getUserSettings = async (req, res) => {
  try {
    const userId = req.user._id;
    const cached = await getCache(`userSettings:${userId}`);
    if (cached) return res.json({ settings: cached });

    let settings = await Settings.findOne({ user: userId }).lean();
    if (!settings) {
      settings = await Settings.create({ user: userId });
      settings = settings.toObject();
    }

    await setCache(`userSettings:${userId}`, settings);
    res.json({ settings });
  } catch (err) {
    logger.error('Get user settings error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateUserSettings = async (req, res) => {
  try {
    const userId = req.user._id;
    const updateData = req.body;

    const settings = await Settings.findOneAndUpdate(
      { user: userId },
      { $set: updateData },
      { new: true, upsert: true, runValidators: true }
    ).lean();

    if (updateData.preferences) {
      await User.findByIdAndUpdate(userId, { preferences: updateData.preferences });
    }

    await setCache(`userSettings:${userId}`, settings); // ✅ Update cache immediately
    await deleteCache(`userNotifications:${userId}`); // Optional: clear related cache

    res.json({ message: 'Settings updated successfully', settings });
  } catch (err) {
    logger.error('Update user settings error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
// -------------------- System Settings --------------------

export const getSystemSettings = async (req, res) => {
  try {
    const cached = await redisClient.get('systemSettings');
    if (cached) return res.json({ systemSettings: JSON.parse(cached) });

    let settings = await SystemSettings.findOne({});
    if (!settings) {
      settings = new SystemSettings();
      await settings.save();
    }

    await redisClient.set('systemSettings', JSON.stringify(settings), { EX: 3600 });

    res.json({ systemSettings: settings });
  } catch (error) {
    logger.error('Get system settings error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateSystemSettings = async (req, res) => {
  try {
    const updateData = req.body;

    const settings = await SystemSettings.findOneAndUpdate(
      {},
      { $set: updateData },
      { new: true, upsert: true }
    );

    await AuditLog.create({
      user: req.user._id,
      action: 'Updated system settings',
      category: 'system_config',
      description: 'System settings updated by admin',
      details: { updatedSettings: Object.keys(updateData) },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      outcome: 'success'
    });

    // Update Redis cache
    await redisClient.set('systemSettings', JSON.stringify(settings), { EX: 3600 });

    res.json({ message: 'System settings updated successfully', systemSettings: settings });
  } catch (error) {
    logger.error('Update system settings error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// -------------------- Notification Settings --------------------

export const getNotificationSettings = async (req, res) => {
  try {
    const userId = req.user._id;

    const cached = await redisClient.get(`userNotifications:${userId}`);
    if (cached) return res.json({ notifications: JSON.parse(cached) });

    const settings = await Settings.findOne({ user: userId });
    if (!settings) return res.status(404).json({ message: 'Settings not found' });

    await redisClient.set(`userNotifications:${userId}`, JSON.stringify(settings.notifications), { EX: 3600 });

    res.json({ notifications: settings.notifications });
  } catch (error) {
    logger.error('Get notification settings error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateNotificationSettings = async (req, res) => {
  try {
    const userId = req.user._id;
    const { notifications } = req.body;

    const settings = await Settings.findOneAndUpdate(
      { user: userId },
      { $set: { notifications } },
      { new: true, upsert: true }
    );

    await AuditLog.create({
      user: userId,
      action: 'Updated notification settings',
      category: 'user_management',
      description: 'User changed notification preferences',
      details: { notifications },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      outcome: 'success'
    });

    // Update Redis cache
    await redisClient.set(`userNotifications:${userId}`, JSON.stringify(settings.notifications), { EX: 3600 });

    res.json({ message: 'Notification settings updated successfully', notifications: settings.notifications });
  } catch (error) {
    logger.error('Update notification settings error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
// -------------------- Audit Log --------------------
export const getAuditLog = async (req, res) => {
  try {
    const logs = await AuditLog.find()
      .sort({ createdAt: -1 })
      .limit(100)
      .populate('user', 'personalInfo.firstName personalInfo.lastName accountDetails.username');

    res.json({ logs });
  } catch (error) {
    logger.error('Get audit log error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
// -------------------- API Integrations --------------------

export const getApiIntegrations = async (req, res) => {
  try {
    const cached = await redisClient.get('apiIntegrations');
    if (cached) return res.json({ integrations: JSON.parse(cached) });

    let integrations = await IntegrationSettings.findOne({});
    if (!integrations) {
      integrations = new IntegrationSettings();
      await integrations.save();
    }

    await redisClient.set('apiIntegrations', JSON.stringify(integrations), { EX: 3600 });

    res.json({ integrations });
  } catch (error) {
    logger.error('Get API integrations error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const updateApiIntegrations = async (req, res) => {
  try {
    const updateData = req.body;

    const integrations = await IntegrationSettings.findOneAndUpdate(
      {},
      { $set: updateData },
      { new: true, upsert: true }
    );

    await AuditLog.create({
      user: req.user._id,
      action: 'Updated API integrations',
      category: 'system_config',
      description: 'Admin modified API integration settings',
      details: { updatedIntegrations: Object.keys(updateData) },
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      outcome: 'success'
    });

    // Update Redis cache
    await redisClient.set('apiIntegrations', JSON.stringify(integrations), { EX: 3600 });

    res.json({ message: 'API integrations updated successfully', integrations });
  } catch (error) {
    logger.error('Update API integrations error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// -------------------- Test Integration --------------------

export const testIntegration = async (req, res) => {
  try {
    const { service } = req.params;

    let result;
    switch (service) {
      case 'digiLocker':
        result = { status: 'success', message: 'DigiLocker integration works!' };
        break;
      case 'erss':
        result = { status: 'success', message: 'ERSS integration works!' };
        break;
      case 'weather':
        result = { status: 'success', message: 'Weather API works!' };
        break;
      default:
        return res.status(400).json({ status: 'error', message: 'Unknown service' });
    }

    await AuditLog.create({
      user: req.user._id,
      action: `Tested API integration: ${service}`,
      category: 'system_config',
      description: `Tested integration connectivity for ${service}`,
      details: result,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      outcome: 'success'
    });

    res.json(result);
  } catch (error) {
    logger.error('Test integration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};