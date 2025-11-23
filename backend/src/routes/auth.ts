import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { supabase } from '../supabaseClient';
import { createUser, findUserByEmail, IUser } from '../models/User';
import { createLoginOtp, findLoginOtp, markLoginOtpUsed, ILoginOTP } from '../models/loginOtpSupabase';
import { sendSmsOtp } from '../utils/smsSender';


const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const OTP_EXPIRY_MINUTES = 5;

// Signup
router.post('/signup', async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      console.error('Signup error: Empty request body');
      return res.status(400).json({ error: 'Empty request body' });
    }

    const { email, password, phone } = req.body;

    if (!email || !password || !phone) {
      console.error('Signup error: Missing required fields');
      return res.status(400).json({ error: 'email, password, and phone are required' });
    }

    // Check if user already exists in DB
    const existingUser = await findUserByEmail(supabase, email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save user in DB
    const newUser: Omit<IUser, 'id' | 'createdAt'> = {
      email,
      password: hashedPassword,
      phone
    };

    const user = await createUser(supabase, newUser);

    if (!user) {
      return res.status(500).json({ error: 'Failed to create user' });
    }

    // Generate OTP
    const otpCode = generateOtp();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000).toISOString();

    // Save OTP in DB
    const newOtp: Omit<ILoginOTP, 'id'> = {
      userId: user.id,
      otpCode,
      expiresAt,
      used: false,
      createdAt: new Date().toISOString(),
    };
    await createLoginOtp(supabase, newOtp);

    // Send OTP via SMS only (if phone exists)
    try {
      if (user.phone) {
        await sendSmsOtp(user.phone, otpCode);
      } else {
        console.warn('No phone number provided, cannot send OTP');
        return res.status(400).json({ error: 'Phone number required for OTP' });
      }
    } catch (sendError) {
      console.error('Failed to send OTP:', sendError);
      return res.status(500).json({ error: 'Failed to send OTP' });
    }

    res.status(201).json({
      message: 'User created successfully and OTP sent to phone if available'
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ error: (error instanceof Error) ? error.message : 'Internal server error' });
  }
});

// Login - Step 1: Verify credentials and send OTP
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user in DB
    const user = await findUserByEmail(supabase, email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate OTP
    const otpCode = generateOtp();
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000).toISOString();

    // Save OTP in DB
    const newOtp: Omit<ILoginOTP, 'id'> = {
      userId: user.id,
      otpCode,
      expiresAt,
      used: false,
      createdAt: new Date().toISOString(),
    };
    await createLoginOtp(supabase, newOtp);

    // Send OTP via SMS only (if phone exists)
    try {
      if (user.phone) {
        await sendSmsOtp(user.phone, otpCode);
      } else {
        console.warn('No phone number provided, cannot send OTP');
        return res.status(400).json({ error: 'Phone number required for OTP' });
      }
    } catch (sendError) {
      console.error('Failed to send OTP:', sendError);
      return res.status(500).json({ error: 'Failed to send OTP' });
    }

    res.json({ message: 'OTP sent to phone if available' });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: (error instanceof Error) ? error.message : 'Internal server error' });
  }
});

// Login - Step 2: Verify OTP and generate JWT
router.post('/login/verify', async (req, res) => {
  try {
    const { email, otpCode } = req.body;

    // Find user
    const user = await findUserByEmail(supabase, email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or OTP' });
    }

    // Find matching OTP record
    const otpRecord = await findLoginOtp(supabase, user.id, otpCode);
    if (!otpRecord || otpRecord.used || new Date(otpRecord.expiresAt) < new Date()) {
      return res.status(401).json({ error: 'Invalid or expired OTP' });
    }

    // Mark OTP as used
    await markLoginOtpUsed(supabase, otpRecord.id);

    // Generate JWT token
    const token = jwt.sign({ userId: user.id, email: user.email, phone: user.phone }, JWT_SECRET, {
      expiresIn: '24h'
    });

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, email: user.email, phone: user.phone }
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    return res.status(500).json({ error: (error instanceof Error) ? error.message : 'Internal server error' });
  }
});

// Logout (client-side token removal, but we can add token blacklisting later)
router.post('/logout', (req, res) => {
  res.json({ message: 'Logout successful' });
});

// Middleware to verify JWT token
export const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

router.post('/signup/verify', async (req, res) => {
  try {
    const { email, otpCode } = req.body;

    // Find user
    const user = await findUserByEmail(supabase, email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or OTP' });
    }

    // Find matching OTP record
    const otpRecord = await findLoginOtp(supabase, user.id, otpCode);
    if (!otpRecord || otpRecord.used || new Date(otpRecord.expiresAt) < new Date()) {
      return res.status(401).json({ error: 'Invalid or expired OTP' });
    }

    // Mark OTP as used
    await markLoginOtpUsed(supabase, otpRecord.id);

    // Generate JWT token
    const token = jwt.sign({ userId: user.id, email: user.email, phone: user.phone }, JWT_SECRET, {
      expiresIn: '24h'
    });

    res.json({
      message: 'Signup confirmation successful',
      token,
      user: { id: user.id, email: user.email, phone: user.phone }
    });
  } catch (error) {
    console.error('Signup OTP verification error:', error);
    return res.status(500).json({ error: (error instanceof Error) ? error.message : 'Internal server error' });
  }
});

export default router;
