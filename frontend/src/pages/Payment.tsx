import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { Card } from './Dashboard';

const Payment: React.FC = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCard, setSelectedCard] = useState<string>('');
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [description, setDescription] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'manual' | 'scan'>('manual');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch user's cards on component mount
  React.useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/cards', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          // Filter to only bank cards for payments
          const bankCards = data.filter((card: Card) => card.categoryId === 'bank');
          setCards(bankCards);
        }
      } catch (error) {
        console.error('Error fetching cards:', error);
      }
    };

    if (token) {
      fetchCards();
    }
  }, [token]);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCard || !amount || !recipient) {
      setMessage('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:5000/api/transactions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cardId: selectedCard,
          description: description || `Payment to ${recipient}`,
          amount: parseFloat(amount),
          type: 'debit',
          merchant: recipient,
          category: 'Payment',
        }),
      });

      if (response.ok) {
        setMessage('Payment processed successfully!');
        // Reset form
        setAmount('');
        setRecipient('');
        setDescription('');
        setSelectedCard('');
      } else {
        setMessage('Payment failed. Please try again.');
      }
    } catch (error) {
      console.error('Payment error:', error);
      setMessage('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleScanPayment = () => {
    // Placeholder for QR/barcode scanning functionality
    setMessage('QR/Barcode scanning feature coming soon!');
  };

  return (
    <div className="dashboard">
      <Header
        user={user}
        onLogout={() => navigate('/login')}
        onAddCard={() => navigate('/dashboard')}
      />
      <div className="dashboard-content">
        <h1>Make a Payment</h1>
        <p>Send money securely using your digital wallet</p>

        <div className="payment-container">
          <div className="payment-methods">
            <button
              className={`payment-method-btn ${paymentMethod === 'manual' ? 'active' : ''}`}
              onClick={() => setPaymentMethod('manual')}
            >
              Manual Payment
            </button>
            <button
              className={`payment-method-btn ${paymentMethod === 'scan' ? 'active' : ''}`}
              onClick={() => setPaymentMethod('scan')}
            >
              Scan to Pay
            </button>
          </div>

          {paymentMethod === 'manual' ? (
            <form onSubmit={handlePayment} className="payment-form">
              <div className="form-group">
                <label>Select Card:</label>
                <select
                  value={selectedCard}
                  onChange={(e) => setSelectedCard(e.target.value)}
                  required
                >
                  <option value="">Choose a card</option>
                  {cards.map((card) => (
                    <option key={card.id} value={card.id}>
                      {card.name} - **** {card.number.slice(-4)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Amount ($):</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="form-group">
                <label>Recipient:</label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="Recipient name or account"
                  required
                />
              </div>

              <div className="form-group">
                <label>Description (Optional):</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Payment description"
                />
              </div>

              <button type="submit" className="payment-submit-btn" disabled={loading}>
                {loading ? 'Processing...' : 'Send Payment'}
              </button>
            </form>
          ) : (
            <div className="scan-payment">
              <div className="scan-area">
                <div className="camera-placeholder">
                  <svg width="100" height="100" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <p>Camera access for QR/Barcode scanning</p>
                  <small>Feature coming soon</small>
                </div>
              </div>
              <button onClick={handleScanPayment} className="scan-btn-large">
                Start Scanning
              </button>
            </div>
          )}

          {message && (
            <div className={`payment-message ${message.includes('successfully') ? 'success' : 'error'}`}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payment;
