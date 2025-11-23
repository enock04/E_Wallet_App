import express from 'express';


const router = express.Router();

// Mock transaction data - in real app, this would come from database
const mockTransactions = [
  {
    id: '1',
    cardId: '1',
    userId: 'demo-user',
    date: '2024-01-15',
    description: 'Grocery Store Purchase',
    amount: -85.50,
    type: 'debit',
    merchant: 'Whole Foods',
    category: 'Groceries',
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    cardId: '1',
    userId: 'demo-user',
    date: '2024-01-14',
    description: 'Salary Deposit',
    amount: 2500.00,
    type: 'credit',
    merchant: 'Employer Inc',
    category: 'Income',
    createdAt: new Date('2024-01-14')
  },
  {
    id: '3',
    cardId: '1',
    userId: 'demo-user',
    date: '2024-01-13',
    description: 'Online Shopping',
    amount: -120.75,
    type: 'debit',
    merchant: 'Amazon',
    category: 'Shopping',
    createdAt: new Date('2024-01-13')
  },
  {
    id: '4',
    cardId: '1',
    userId: 'demo-user',
    date: '2024-01-12',
    description: 'ATM Withdrawal',
    amount: -200.00,
    type: 'debit',
    merchant: 'Bank ATM',
    category: 'Cash',
    createdAt: new Date('2024-01-12')
  },
  {
    id: '5',
    cardId: '1',
    userId: 'demo-user',
    date: '2024-01-11',
    description: 'Restaurant Payment',
    amount: -45.20,
    type: 'debit',
    merchant: 'Italian Bistro',
    category: 'Dining',
    createdAt: new Date('2024-01-11')
  },
  {
    id: '6',
    cardId: '1',
    userId: 'demo-user',
    date: '2024-01-10',
    description: 'Utility Bill Payment',
    amount: -150.00,
    type: 'debit',
    merchant: 'Electric Company',
    category: 'Utilities',
    createdAt: new Date('2024-01-10')
  },
  {
    id: '7',
    cardId: '1',
    userId: 'demo-user',
    date: '2024-01-09',
    description: 'Freelance Payment',
    amount: 750.00,
    type: 'credit',
    merchant: 'Client XYZ',
    category: 'Income',
    createdAt: new Date('2024-01-09')
  },
  {
    id: '8',
    cardId: '1',
    userId: 'demo-user',
    date: '2024-01-08',
    description: 'Gas Station',
    amount: -65.30,
    type: 'debit',
    merchant: 'Shell',
    category: 'Transportation',
    createdAt: new Date('2024-01-08')
  }
];

// Get transactions for a specific card
router.get('/card/:cardId', (req, res) => {
  const { cardId } = req.params;
  const cardTransactions = mockTransactions.filter(t => t.cardId === cardId);

  // Sort by date descending
  cardTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Add pagination support
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const paginatedTransactions = cardTransactions.slice(startIndex, endIndex);

  res.json({
    transactions: paginatedTransactions,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(cardTransactions.length / limit),
      totalTransactions: cardTransactions.length,
      hasNext: endIndex < cardTransactions.length,
      hasPrev: page > 1
    }
  });
});

// Get all transactions for user (for demo purposes)
router.get('/', (req, res) => {
  // In real app, get userId from JWT token
  const userTransactions = mockTransactions.filter(t => t.userId === 'demo-user');
  userTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  res.json(userTransactions);
});

// Add new transaction (for payment processing)
router.post('/', (req, res) => {
  const { cardId, description, amount, type, merchant, category } = req.body;

  const newTransaction = {
    id: Date.now().toString(),
    cardId,
    userId: 'demo-user', // In real app, get from JWT
    date: new Date().toISOString().split('T')[0],
    description,
    amount: type === 'debit' ? -Math.abs(amount) : Math.abs(amount),
    type,
    merchant,
    category,
    createdAt: new Date()
  };

  mockTransactions.push(newTransaction);
  res.status(201).json(newTransaction);
});

export default router;
