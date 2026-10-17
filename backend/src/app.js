import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import { webhookHandler } from './routes/payments.js';
import authRoutes from './routes/auth.js';
import quoteRoutes from './routes/quotes.js';
import addressRoutes from './routes/addresses.js';
import shipmentRoutes from './routes/shipments.js';
import paymentRoutes from './routes/payments.js';
import trackingRoutes from './routes/tracking.js';
import adminRoutes from './routes/admin.js';
import adminPageRoutes from './routes/adminPages.js';
import selfPurchaseRoutes from './routes/selfPurchase.js';
import assistedPurchaseRoutes from './routes/assistedPurchase.js';
import bookShipmentRoutes from './routes/bookShipment.js';
import { notFound } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandler.js';
import { authLimiter, quoteLimiter } from './middleware/rateLimit.js';

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(cookieParser());
app.use(cors());
app.use(morgan('dev'));
app.use(helmet({
  contentSecurityPolicy: false,
}));

const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), webhookHandler);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

const frontendDistPath = path.join(__dirname, '..', '..', 'frontend', 'dist');
const serveFrontend = process.env.NODE_ENV === 'production' && fs.existsSync(frontendDistPath);
if (serveFrontend) {
  app.use(express.static(frontendDistPath));
}

app.get('/', (req, res) => {
  if (serveFrontend) {
    return res.sendFile(path.join(frontendDistPath, 'index.html'));
  }
  res.redirect('/admin');
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/admin', adminPageRoutes);

app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/quotes', quoteLimiter, quoteRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/shipments', shipmentRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/track', trackingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/self-purchase', selfPurchaseRoutes);
app.use('/api/assisted-purchase', assistedPurchaseRoutes);
app.use('/api/book-shipment', bookShipmentRoutes);

if (serveFrontend) {
  app.use((req, res) => {
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
}

app.use(notFound);
app.use(errorHandler);

export default app;
