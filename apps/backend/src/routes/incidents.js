import { Router } from 'express';
import {
  createIncident,
  getIncidents,
  getIncident,
  updateIncident,
  deleteIncident,
  assignIncident,
  resolveIncident,
  getIncidentStats,
  getNearbyIncidents,
  getIncidentTimeline,
  addIncidentUpdate
} from '../controllers/incidentController.js';
import { protect, restrictTo } from '../middlewares/authMiddleware.js';
import { validateIncident } from '../middlewares/validationMiddleware.js';
import { upload } from '../middlewares/uploadMiddleware.js';

const router = Router();

// Protect all routes
router.use(protect);

router.get('/stats', getIncidentStats);
router.get('/nearby', getNearbyIncidents);
router.get('/', getIncidents);
router.post('/', upload.array('attachments', 5), validateIncident, createIncident);
router.get('/:id', getIncident);
router.put('/:id', updateIncident);
router.delete('/:id', restrictTo('admin', 'supervisor'), deleteIncident);

// Incident management actions
router.put('/:id/assign', restrictTo('supervisor', 'admin'), assignIncident);
router.put('/:id/resolve', resolveIncident);
router.get('/:id/timeline', getIncidentTimeline);
router.post('/:id/updates', upload.array('attachments', 3), addIncidentUpdate);

export default router;