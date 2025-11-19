// import { Router } from 'express';
// import {
//   getUserSettings,
//   updateUserSettings,
//   getSystemSettings,
//   updateSystemSettings,
//   getAuditLog,
//   getApiIntegrations,
//   updateApiIntegrations,
//   testIntegration,
//   getNotificationSettings,
//   updateNotificationSettings
// } from '../controllers/settingsController.js';
// import { protect, restrictTo } from '../middlewares/authMiddleware.js';

// const router = Router();

// // Protect all routes
// router.use(protect);

// // User settings
// router.get('/', getUserSettings);
// router.put('/', updateUserSettings);

// // System settings (admin only)
// router.get('/system', restrictTo('admin'), getSystemSettings);
// router.put('/system', restrictTo('admin'), updateSystemSettings);
// router.get('/audit-log', restrictTo('admin', 'supervisor'), getAuditLog);

// // API integrations
// router.get('/integrations', restrictTo('admin'), getApiIntegrations);
// router.put('/integrations', restrictTo('admin'), updateApiIntegrations);
// router.post('/integrations/:service/test', restrictTo('admin'), testIntegration);

// // Notification settings
// router.get('/notifications', getNotificationSettings);
// router.put('/notifications', updateNotificationSettings);

// export default router;

import { Router } from 'express';  
// import {  
//   getUserSettings,  
//   updateUserSettings,  
//   getSystemSettings,  
//   updateSystemSettings,  
//   getAuditLog,  
//   getApiIntegrations,  
//   updateApiIntegrations,  
//   testIntegration,  
//   getNotificationSettings,  
//   updateNotificationSettings  
// } from '../controllers/settingsController.js';  
import {
  getUserSettings,
  updateUserSettings,
  getSystemSettings,
  updateSystemSettings,
  getNotificationSettings,
  updateNotificationSettings,
  getAuditLog,
  getApiIntegrations,
  updateApiIntegrations,
  testIntegration
} from '../controllers/settingsController.js';
import { protect, restrictTo } from '../middlewares/authMiddleware.js';  

const router = Router();  

// Protect all routes
router.use(protect);

// User settings
router.get('/', getUserSettings);
router.put('/', updateUserSettings);

// System settings (admin only)
router.get('/system', restrictTo('admin'), getSystemSettings);
router.put('/system', restrictTo('admin'), updateSystemSettings);

// Preferences route (frontend needs this)
router.get('/preferences', restrictTo('admin'), getSystemSettings);
router.put('/preferences', restrictTo('admin'), updateSystemSettings);

// Audit log
router.get('/audit-log', restrictTo(['admin', 'supervisor']), getAuditLog);

// API integrations
router.get('/integrations', restrictTo('admin'), getApiIntegrations);
router.put('/integrations', restrictTo('admin'), updateApiIntegrations);
router.post('/integrations/:service/test', restrictTo('admin'), testIntegration);

// Notification settings
router.get('/notifications', getNotificationSettings);
router.put('/notifications', updateNotificationSettings);

export default router;