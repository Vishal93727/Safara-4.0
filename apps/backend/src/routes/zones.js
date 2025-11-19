import { Router } from 'express';
import {
  createZone,
  getZones,
  getZone,
  updateZone,
  deleteZone,
  getZoneStats,
  getZoneIncidents,
  getZoneTourists
} from '../controllers/zoneController.js';
import { protect, restrictTo } from '../middlewares/authMiddleware.js';

const router = Router();

// Protect all routes
router.use(protect);

router.get('/', getZones);
router.post('/', restrictTo('admin', 'supervisor'), createZone);
router.get('/stats', getZoneStats);
router.get('/:id', getZone);
router.put('/:id', restrictTo('admin', 'supervisor'), updateZone);
router.delete('/:id', restrictTo('admin'), deleteZone);

router.get('/:id/incidents', getZoneIncidents);
router.get('/:id/tourists', getZoneTourists);

export default router;