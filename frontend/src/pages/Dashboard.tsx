import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import Header from '../components/Header.tsx';
import CardList from '../components/CardList.tsx';
import AddCardModal from '../components/AddCardModal.tsx';

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
}

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Mock data
  const categories: Category[] = [
    { id: 'all', name: 'All Cards' },
    { id: 'bank', name: 'Bank Cards' },
    { id: 'ids', name: 'IDs' },
    { id: 'license', name: 'License' },
    { id: 'transit', name: 'Transit' },
    { id: 'documents', name: 'Documents' },
  ];

  const [cards, setCards] = useState<Card[]>([
    {
      id: '1',
      name: 'Ntwari Enock',
      number: '4242424242424242',
      expiry: '12/25',
      categoryId: 'bank',
    },
    {
      id: '2',
      name: 'Lydvine Umutesi',
      number: 'ID-123456789',
      expiry: '',
      categoryId: 'ids',
    },
    {
      id: '3',
      name: 'Tabitha Akimana',
      number: 'MP-987654',
      expiry: '06/25',
      categoryId: 'transit',
    },
    {
      id: '4',
      name: 'Tito Sibo',
      number: 'DL-456789',
      expiry: '03/26',
      categoryId: 'license',
    },
  ]);

  const addCard = (card: Omit<Card, 'id'>) => {
    const newCard: Card = { ...card, id: Date.now().toString() };
    setCards([...cards, newCard]);
  };

  const filteredCards = selectedCategory === 'all' ? cards : cards.filter((card) => card.categoryId === selectedCategory);

  return (
    <div className="dashboard">
      <Header user={user} onLogout={logout} onAddCard={() => setIsAddModalOpen(true)} />
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
      <div className="dashboard-content">
        <h1>Welcome to E-Wallet Dashboard, {user}!</h1>
        <p>Your secure digital wallet.</p>
        <CardList cards={filteredCards} />
      </div>
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