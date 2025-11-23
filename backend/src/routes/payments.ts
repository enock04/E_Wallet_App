import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import Payment from '../models/Payment';
import Transaction from '../models/Transaction';
import Card from '../models/Card';


const router = express.Router();

interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email?: string;
    phone?: string;
  };
}

// Middleware to verify JWT token
const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Create a payment
router.post('/', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { fromCardId, to, amount, method = 'manual' } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Verify card belongs to user and is a bank card
    const card = await Card.findOne({
      _id: fromCardId,
      userId: req.user.userId,
      categoryId: 'bank'
    });

    if (!card) {
      return res.status(404).json({ message: 'Bank card not found' });
    }

    // Create payment record
    const payment = new Payment({
      fromCardId,
      to,
      amount,
      method,
      status: 'pending'
    });

    await payment.save();

    // Create debit transaction
    const transaction = new Transaction({
      cardId: fromCardId,
      type: 'debit',
      amount,
      description: `Payment to ${to}`,
      merchant: to,
      paymentId: payment._id.toString(),
      status: 'completed'
    });

    await transaction.save();

    // Update payment status
    payment.status = 'completed';
    payment.completedAt = new Date();
    payment.transactionId = transaction._id.toString();
    await payment.save();

    res.json({
      success: true,
      payment: {
        id: payment._id,
        amount: payment.amount,
        to: payment.to,
        status: payment.status,
        completedAt: payment.completedAt
      },
      transaction: {
        id: transaction._id,
        amount: transaction.amount,
        description: transaction.description,
        date: transaction.date
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get payment history
router.get('/', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    // Get all cards for this user
    const userCards = await Card.find({ userId: req.user.userId });
    const cardIds = userCards.map(card => card._id);

    const payments = await Payment.find({
      fromCardId: { $in: cardIds }
    }).sort({ createdAt: -1 });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get payment by ID
router.get('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Verify payment belongs to user
    const card = await Card.findOne({
      _id: payment.fromCardId,
      userId: req.user.userId
    });

    if (!card) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Scan-to-pay endpoint (placeholder for future implementation)
router.post('/scan', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { scannedData, amount } = req.body;

    // In production, this would:
    // 1. Parse scanned QR/barcode data
    // 2. Extract payment details
    // 3. Process payment without exposing full PAN

    res.json({
      message: 'Scan-to-pay functionality coming soon',
      scannedData,
      amount
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
