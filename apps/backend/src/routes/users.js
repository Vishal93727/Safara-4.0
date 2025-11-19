import { Router } from 'express';
import {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  getUserStats,
  approveUser,
  rejectUser,
  suspendUser,
  activateUser,
  getUserAuditLog
} from '../controllers/userController.js';
import { protect, restrictTo } from '../middlewares/authMiddleware.js';

const router = Router();

// Protect all routes
router.use(protect);

router.get('/', restrictTo('admin', 'supervisor'), getAllUsers);
router.get('/stats', restrictTo('admin', 'supervisor'), getUserStats);
router.get('/:id', getUser);
router.put('/:id', restrictTo('admin', 'supervisor'), updateUser);
router.delete('/:id', restrictTo('admin'), deleteUser);

// User management actions
router.put('/:id/approve', restrictTo('admin', 'supervisor'), approveUser);
router.put('/:id/reject', restrictTo('admin', 'supervisor'), rejectUser);
router.put('/:id/suspend', restrictTo('admin'), suspendUser);
router.put('/:id/activate', restrictTo('admin'), activateUser);
router.get('/:id/audit-log', restrictTo('admin', 'supervisor'), getUserAuditLog);

export default router;