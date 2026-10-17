import express from 'express';
import auth from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import {
  registerValidation,
  loginValidation,
  register,
  login,
  me,
  logout,
} from '../controllers/authController.js';

const router = express.Router();

router.post('/register', upload.single('tradeLicense'), registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/me', auth, me);
router.post('/logout', auth, logout);

export default router;
