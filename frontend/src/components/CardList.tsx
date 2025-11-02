import React, { useState } from 'react';
import CardItem from './CardItem.tsx';
import CardDetailModal from './CardDetailModal.tsx';
import { Card } from '../pages/Dashboard.tsx';

interface CardListProps {
  cards: Card[];
}

const CardList: React.FC<CardListProps> = ({ cards }) => {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  const handleCardClick = (card: Card) => {
    setSelectedCard(card);
  };

  const closeModal = () => {
    setSelectedCard(null);
  };

  return (
    <div className="card-list">
      {cards.length === 0 ? (
        <p>No cards in this category.</p>
      ) : (
        cards.map((card) => (
          <CardItem key={card.id} card={card} onClick={handleCardClick} />
        ))
      )}
      {selectedCard && (
        <CardDetailModal card={selectedCard} onClose={closeModal} />
      )}
    </div>
  );
};

export default CardList;
