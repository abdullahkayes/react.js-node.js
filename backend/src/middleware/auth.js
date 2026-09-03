import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

const auth = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return next({ statusCode: 401, message: 'No token, authorization denied' });
    }

    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findByPk(decoded.id, {
      attributes: ['id', 'name', 'email', 'role'],
    });
    if (!user) {
      return next({ statusCode: 401, message: 'Token is not valid' });
    }

    req.user = user;
    next();
  } catch (error) {
    return next({ statusCode: 401, message: 'Token is not valid' });
  }
};

export default auth;
