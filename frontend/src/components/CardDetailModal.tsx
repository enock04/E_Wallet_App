import React from 'react';
import { Card } from '../pages/Dashboard.tsx';

interface CardDetailModalProps {
  card: Card;
  onClose: () => void;
}

const CardDetailModal: React.FC<CardDetailModalProps> = ({ card, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Card Details</h2>
        <div className="card-detail">
          <p><strong>Name:</strong> {card.name}</p>
          <p><strong>Number:</strong> {card.number}</p>
          <p><strong>Expiry:</strong> {card.expiry}</p>
        </div>
        <button className="close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default CardDetailModal;

