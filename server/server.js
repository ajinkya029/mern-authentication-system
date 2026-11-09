import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth.js';

const app = express();
const PORT = process.env.PORT || 5000;

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is missing. Add it to server/.env');
}

app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { message: 'Too many authentication attempts. Please try again later.' }
});
app.use('/api/auth', authLimiter, authRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.status ? err.message : 'Internal server error'
  });
});

try {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
} catch (error) {
  console.error('Failed to connect to MongoDB:', error.message);
  process.exit(1);
}
