import { Router } from 'express';
import {
  generateDashboardReport,
  generateIncidentReport,
  generateUserReport,
  generateZoneReport,
  getReportHistory,
  downloadReport,
  scheduleReport
} from '../controllers/reportController.js';
import { protect, restrictTo } from '../middlewares/authMiddleware.js';

const router = Router();

// Protect all routes
router.use(protect);

router.get('/dashboard', generateDashboardReport);
router.get('/incidents', generateIncidentReport);
router.get('/users', restrictTo('admin', 'supervisor'), generateUserReport);
router.get('/zones', generateZoneReport);
router.get('/history', getReportHistory);
router.get('/download/:reportId', downloadReport);
router.post('/schedule', restrictTo('admin', 'supervisor'), scheduleReport);

export default router;
