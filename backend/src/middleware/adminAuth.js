import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

const adminAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.adminToken;
    if (!token) {
      return res.redirect('/admin/login');
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(decoded.id, {
      attributes: ['id', 'name', 'email', 'role'],
    });

    if (!user) {
      return res.redirect('/admin/login');
    }

    if (user.role !== 'admin' && user.role !== 'staff') {
      return res.status(403).render('admin/403', { message: 'Access denied' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.redirect('/admin/login');
  }
};

export default adminAuth;
