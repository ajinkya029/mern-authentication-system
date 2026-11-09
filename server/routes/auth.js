import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { requireAuth, cookieOptions } from '../middleware/requireAuth.js';

const router = Router();
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function createToken(userId) {
  return jwt.sign({}, process.env.JWT_SECRET, {
    subject: userId.toString(),
    expiresIn: process.env.JWT_EXPIRES_IN || '1d'
  });
}

function publicUser(user) {
  return { id: user._id, name: user.name, email: user.email };
}

router.post('/signup', async (req, res, next) => {
  try {
    const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const password = typeof req.body.password === 'string' ? req.body.password : '';

    if (name.length < 2 || name.length > 60) {
      return res.status(400).json({ message: 'Name must be between 2 and 60 characters.' });
    }
    if (!emailPattern.test(email) || email.length > 254) {
      return res.status(400).json({ message: 'Please enter a valid email address.' });
    }
    if (password.length < 8 || password.length > 72) {
      return res.status(400).json({ message: 'Password must be between 8 and 72 characters.' });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'An account with this email already exists.' });

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hashedPassword });
    res.cookie('token', createToken(user._id), cookieOptions());
    return res.status(201).json({ user: publicUser(user) });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: 'An account with this email already exists.' });
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const password = typeof req.body.password === 'string' ? req.body.password : '';
    if (!emailPattern.test(email) || !password) {
      return res.status(400).json({ message: 'Enter a valid email and password.' });
    }

    const user = await User.findOne({ email }).select('+password');
    const valid = user && await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid email or password.' });

    res.cookie('token', createToken(user._id), cookieOptions());
    return res.json({ user: publicUser(user) });
  } catch (error) {
    next(error);
  }
});

router.post('/logout', (_req, res) => {
  res.clearCookie('token', cookieOptions());
  res.json({ message: 'Logged out successfully.' });
});

router.get('/me', requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(401).json({ message: 'Account not found.' });
    res.json({ user: publicUser(user) });
  } catch (error) {
    next(error);
  }
});

export default router;
