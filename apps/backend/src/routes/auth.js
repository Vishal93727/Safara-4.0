// import { Router } from 'express';
// import {
//   register,
//   login,
//   logout,
//   getProfile,
//   updateProfile,
//   changePassword,
//   forgotPassword,
//   resetPassword,
//   refreshToken,
//   verifyEmail
// } from '../controllers/authController.js';
// import { protect } from '../middlewares/authMiddleware.js';
// import { validateRegistration, validateLogin } from '../middlewares/validationMiddleware.js';
// import { upload } from '../middlewares/uploadMiddleware.js';

// const router = Router();

// router.post('/register', upload.fields([
//   { name: 'profilePhoto', maxCount: 1 },
//   { name: 'idProof', maxCount: 1 },
//   { name: 'addressProof', maxCount: 1 },
//   { name: 'departmentLetter', maxCount: 1 },
//   { name: 'joiningLetter', maxCount: 1 }
// ]), validateRegistration, register);

// router.post('/login', validateLogin, login);
// router.post('/logout', protect, logout);
// router.post('/refresh-token', refreshToken);
// router.post('/forgot-password', forgotPassword);
// router.put('/reset-password/:token', resetPassword);
// router.get('/verify-email/:token', verifyEmail);

// router.get('/profile', protect, getProfile);
// router.put('/profile', protect, updateProfile);
// router.put('/change-password', protect, changePassword);

// export default router;

import { Router } from 'express';
import {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  refreshToken,
  verifyEmail
} from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { validateRegistration, validateLogin } from '../middlewares/validationMiddleware.js';

const router = Router();

// ✅ Register expects JSON only now (no multer upload)
router.post('/register', validateRegistration, register);

router.post('/login', validateLogin, login);
router.post('/logout', protect, logout);
router.post('/refresh-token', refreshToken);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);
router.get('/verify-email/:token', verifyEmail);

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);

export default router;