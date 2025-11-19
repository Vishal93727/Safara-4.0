import { Router } from 'express';
import {
  uploadSingle,
  uploadMultiple,
  deleteUpload,
  getUpload
} from '../controllers/uploadController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/uploadMiddleware.js';

const router = Router();

// Protect all routes
router.use(protect);

router.post('/single', upload.single('file'), uploadSingle);
router.post('/multiple', upload.array('files', 10), uploadMultiple);
router.get('/:publicId', getUpload);
router.delete('/:publicId', deleteUpload);

export default router;