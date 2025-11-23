import express from 'express';
import { authenticateToken } from './auth';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Set up multer storage for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Upload folder (ensure this folder exists)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage: storage });

// In-memory storage for demo purposes (shared with auth.ts)
let cards: any[] = [
  { id: '1', name: 'Ntwari Enock', number: '1234567890123456', expiry: '12/26', categoryId: 'bank', cardHolder: 'Ntwari Enock', issuer: 'Visa', userId: '1', imageUrl: '' },
  { id: '2', name: 'Tito Sibo', number: '5678567856785678', expiry: '08/27', categoryId: 'bank', cardHolder: 'Tito Sibo', issuer: 'Mastercard', userId: '1', imageUrl: '' },
  { id: '3', name: 'Elvis IShimwe', number: '9012901290129012', expiry: '03/28', categoryId: 'bank', cardHolder: 'Elvis IShimwe', issuer: 'Visa', userId: '1', imageUrl: '' },
  { id: '4', name: 'Driver License', number: 'DL-123456789', expiry: '05/30', categoryId: 'license', cardHolder: 'John Doe', issuer: 'DMV', userId: '1', imageUrl: '' },
  { id: '5', name: 'National ID', number: 'ID-987654321', expiry: 'N/A', categoryId: 'ids', cardHolder: 'John Doe', issuer: 'Government', userId: '1', imageUrl: '' },
  { id: '6', name: 'Transit Pass', number: 'MP-456789123', expiry: '12/24', categoryId: 'transit', cardHolder: 'John Doe', issuer: 'Metro', userId: '1', imageUrl: '' },
  { id: '7', name: 'Business Card', number: '3456345634563456', expiry: '11/29', categoryId: 'bank', cardHolder: 'Jane Smith', issuer: 'American Express', userId: '1', imageUrl: '' },
  { id: '8', name: 'Passport', number: 'P-789123456', expiry: '06/35', categoryId: 'documents', cardHolder: 'John Doe', issuer: 'State Department', userId: '1', imageUrl: '' }
];

// Get all cards for authenticated user
router.get('/', authenticateToken, async (req: any, res: any) => {
  try {
    // For demo purposes, return all cards (including pre-seeded ones)
    res.json(cards);
  } catch (error) {
    console.error('Get cards error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new card with image upload support
router.post('/', authenticateToken, upload.single('image'), async (req: any, res: any) => {
  try {
    const { name, number, expiry, categoryId, cardHolder, issuer } = req.body;
    let imageUrl = '';

    if (!name || !number || !categoryId) {
      return res.status(400).json({ error: 'Name, number, and categoryId are required' });
    }

    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const card = {
      id: Date.now().toString(),
      name,
      number,
      expiry: expiry || '',
      categoryId,
      cardHolder: cardHolder || '',
      issuer: issuer || '',
      userId: req.user.userId,
      imageUrl
    };

    cards.push(card);
    res.status(201).json(card);
  } catch (error) {
    console.error('Create card error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a card
router.put('/:id', authenticateToken, async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { name, number, expiry, categoryId, cardHolder, issuer } = req.body;

    const cardIndex = cards.findIndex(card => card.id === id && card.userId === req.user.userId);
    if (cardIndex === -1) {
      return res.status(404).json({ error: 'Card not found' });
    }

    const card = cards[cardIndex];
    if (name !== undefined) card.name = name;
    if (number !== undefined) card.number = number;
    if (expiry !== undefined) card.expiry = expiry;
    if (categoryId !== undefined) card.categoryId = categoryId;
    if (cardHolder !== undefined) card.cardHolder = cardHolder;
    if (issuer !== undefined) card.issuer = issuer;

    res.json(card);
  } catch (error) {
    console.error('Update card error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a card
router.delete('/:id', authenticateToken, async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const cardIndex = cards.findIndex(card => card.id === id && card.userId === req.user.userId);

    if (cardIndex === -1) {
      return res.status(404).json({ error: 'Card not found' });
    }

    cards.splice(cardIndex, 1);
    res.json({ message: 'Card deleted successfully' });
  } catch (error) {
    console.error('Delete card error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
