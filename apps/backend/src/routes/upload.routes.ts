import { Router } from 'express';
import { uploadFile } from '../controllers/upload.controller';
import { upload } from '../config/multer';

const router = Router();

router.post('/', upload.single('file'), uploadFile);

export default router;