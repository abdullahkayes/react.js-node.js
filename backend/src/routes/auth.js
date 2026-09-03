import express from 'express';
import auth from '../middleware/auth.js';
import {
  registerValidation,
  loginValidation,
  register,
  login,
  me,
  logout,
} from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/me', auth, me);
router.post('/logout', auth, logout);

export default router;
