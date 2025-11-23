import { sendEmailOtp } from '../utils/emailSender';
import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import VerificationRecord from '../models/VerificationRecord';
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

// Generate verification code for possession authentication
router.post('/generate-code', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { cardId } = req.body;

    // Verify card belongs to user
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    const card = await Card.findOne({ _id: cardId, userId: req.user.userId });
    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Send OTP code to user's registered email
    if (req.user.email) {
      try {
        await sendEmailOtp(req.user.email, code);
      } catch (emailError) {
        console.error('Error sending OTP email:', emailError);
        return res.status(500).json({ message: 'Failed to send OTP email' });
      }
    } else {
      console.warn('No email found for user; OTP email not sent.');
    }

    // Store code temporarily (in production, use Redis or similar)
    // For demo, we'll return it directly
    res.json({
      code,
      instructions: 'Hold your physical card and this code on paper next to it; take a short selfie video while showing both.'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/verify/:cardId', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { cardId } = req.params;
    const { code, videoUrl } = req.body; // videoUrl would be uploaded file URL

    // Verify card belongs to user
    const card = await Card.findOne({ _id: cardId, userId: req.user?.userId });
    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }

    // In production, this would involve:
    // 1. Liveness detection on video
    // 2. OCR on card image from video
    // 3. Code verification
    // 4. Automated checks

    // For demo, simulate verification
    const isVerified = Math.random() > 0.3; // 70% success rate
    const result = isVerified ? 'passed' : 'pending_review';

    // Create verification record
    const verificationRecord = new VerificationRecord({
      cardId,
      method: 'selfie_video',
      result,
      evidenceUrl: videoUrl,
      notes: isVerified ? 'Automated verification passed' : 'Requires manual review'
    });

    await verificationRecord.save();

    // Update card status
    if (isVerified) {
      card.verifiedStatus = 'verified';
      card.verificationDate = new Date();
    } else {
      card.verifiedStatus = 'pending';
    }
    await card.save();

    res.json({
      success: isVerified,
      status: card.verifiedStatus,
      message: isVerified ? 'Card verified successfully' : 'Verification submitted for review'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/status/:cardId', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    const { cardId } = req.params;
    const card = await Card.findOne({ _id: cardId, userId: req.user.userId });
    if (!card) {
      return res.status(404).json({ message: 'Card not found' });
    }

    const latestVerification = await VerificationRecord.findOne({ cardId })
      .sort({ timestamp: -1 })
      .limit(1);

    res.json({
      verifiedStatus: card.verifiedStatus,
      verificationDate: card.verificationDate,
      latestVerification
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin endpoint to review pending verifications
router.post('/review/:verificationId', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    // In production, check if user is admin
    const { verificationId } = req.params;
    const { approved, notes } = req.body;

    const verification = await VerificationRecord.findById(verificationId);
    if (!verification) {
      return res.status(404).json({ message: 'Verification record not found' });
    }

    verification.result = approved ? 'passed' : 'failed';
    verification.reviewerId = req.user.userId;
    verification.notes = notes;
    await verification.save();

    // Update card status
    const card = await Card.findById(verification.cardId);
    if (card) {
      card.verifiedStatus = approved ? 'verified' : 'failed';
      if (approved) {
        card.verificationDate = new Date();
      }
      await card.save();
    }

    res.json({ message: 'Verification reviewed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
