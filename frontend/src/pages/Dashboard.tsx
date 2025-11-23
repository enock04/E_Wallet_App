import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import CardList from '../components/CardList';
import AddCardModal from '../components/AddCardModal';


export interface Category {
  id: string;
  name: string;
}

export interface Card {
  id: string;
  name: string;
  number: string;
  expiry: string;
  categoryId: string;
  cardHolder?: string;
  issuer?: string;
  userId?: string;
  verifiedStatus?: 'pending' | 'verified' | 'failed';
  verificationDate?: string;
  tokenId?: string;
}

const Dashboard: React.FC = () => {
  const { user, token, logout } = useAuth() as {
    user: { name?: string } | string | null;
    token: string | null;
    logout: () => void;
  };
  const navigate = useNavigate();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);


  const categories: Category[] = [
    { id: 'all', name: 'All Cards' },
    { id: 'bank', name: 'Bank Cards' },
    { id: 'ids', name: 'IDs' },
    { id: 'license', name: 'License' },
    { id: 'transit', name: 'Transit' },
    { id: 'documents', name: 'Documents' },
  ];

  const fetchCards = async () => {
    if (!token) return;

    try {
      const response = await fetch('http://localhost:5000/api/cards', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCards(data);
      }
    } catch (error) {
      console.error('Error fetching cards:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const addCard = async (card: Omit<Card, 'id'> & { imageFile?: File }) => {
    if (!token) return;

    try {
      const formData = new FormData();
      formData.append('name', card.name);
      formData.append('number', card.number);
      formData.append('expiry', card.expiry || '');
      formData.append('categoryId', card.categoryId);
      if (card.cardHolder) formData.append('cardHolder', card.cardHolder);
      if (card.issuer) formData.append('issuer', card.issuer);
      if (card.imageFile) formData.append('image', card.imageFile);

      const response = await fetch('http://localhost:5000/api/cards', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const newCard = await response.json();
        setCards([...cards, newCard]);
      }
    } catch (error) {
      console.error('Error adding card:', error);
    }
  };

  const updateCard = async (updatedCard: Card) => {
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:5000/api/cards/${updatedCard.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedCard),
      });

      if (response.ok) {
        setCards(cards.map(card => card.id === updatedCard.id ? updatedCard : card));
      }
    } catch (error) {
      console.error('Error updating card:', error);
    }
  };

  const deleteCard = async (cardId: string) => {
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:5000/api/cards/${cardId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setCards(cards.filter(card => card.id !== cardId));
      }
    } catch (error) {
      console.error('Error deleting card:', error);
    }
  };

  const filteredCards = selectedCategory === 'all' ? cards : cards.filter((card) => card.categoryId === selectedCategory);

  // Calculate metrics
  const cardsCount = cards.length;
  const documentsCount = cards.filter(card => card.categoryId === 'documents').length;
  const transactionsCount = 42; // Mock data - in real app, fetch from API

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="dashboard-content">
          <p>Loading...</p>
        </div>
        <nav className="bottom-nav">
          <div className="nav-item active" onClick={() => navigate('/dashboard')}>
            <span className="nav-icon">🏠</span>
            <span className="nav-label">Home</span>
          </div>
          <div className="nav-item" onClick={() => setIsAddModalOpen(true)} title="Add Card">
            <span className="nav-icon" style={{color:'blue'}}>➕</span>
            <span className="nav-label">Add Card</span>
          </div>
          <div className="nav-item" onClick={() => setIsAddModalOpen(true)} title="Add Document">
            <span className="nav-icon" style={{color:'green'}}>📄</span>
            <span className="nav-label">Add Document</span>
          </div>
          <div className="nav-item" onClick={() => navigate('/payment')} title="Scan">
            <span className="nav-icon" style={{color:'purple'}}>📱</span>
            <span className="nav-label">Scan</span>
          </div>
          <div className="nav-item" onClick={() => navigate('/profile')}>
            <span className="nav-icon">👤</span>
            <span className="nav-label">Profile</span>
          </div>
        </nav>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-content">
        {/* Welcome Section */}
        <div className="welcome-section">
          <h1 className="welcome-text">Welcome back,</h1>
          <h2 className="username">{typeof user === 'string' ? user : user?.name || 'User'}</h2>
        </div>

        {/* Metrics Overview */}
        <div className="metrics-section">
          <div className="metric-card">
            <div className="metric-icon">💳</div>
            <div className="metric-number">{cardsCount}</div>
            <div className="metric-label">Cards</div>
          </div>
          <div className="metric-card">
            <div className="metric-icon">📄</div>
            <div className="metric-number">{documentsCount}</div>
            <div className="metric-label">Documents</div>
          </div>
          <div className="metric-card">
            <div className="metric-icon">💸</div>
            <div className="metric-number">{transactionsCount}</div>
            <div className="metric-label">Transactions</div>
          </div>
        </div>

        {/* Quick Actions removed from main content */}

        {/* Cards Section */}
        <div className="cards-section">
          <div className="category-bar">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
          <CardList
            cards={filteredCards}
            onEditCard={updateCard}
            onDeleteCard={deleteCard}
          />
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <div className="nav-item active" onClick={() => navigate('/dashboard')}>
          <span className="nav-icon">🏠</span>
          <span className="nav-label">Home</span>
        </div>
        <div className="nav-item" onClick={() => setIsAddModalOpen(true)} title="Add Card">
          <span className="nav-icon" style={{color:'blue'}}>➕</span>
          <span className="nav-label">Add Card</span>
        </div>
        <div className="nav-item" onClick={() => setIsAddModalOpen(true)} title="Add Document">
          <span className="nav-icon" style={{color:'green'}}>📄</span>
          <span className="nav-label">Add Document</span>
        </div>
        <div className="nav-item" onClick={() => navigate('/profile')}>
          <span className="nav-icon">👤</span>
          <span className="nav-label">Profile</span>
        </div>
      </nav>

      {isAddModalOpen && (
        <AddCardModal
          categories={categories.filter(cat => cat.id !== 'all')}
          onAdd={addCard}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
