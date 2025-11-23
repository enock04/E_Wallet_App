import React from 'react';
import { Card } from '../pages/Dashboard';


interface CardItemProps {
  card: Card;
  onClick: (card: Card) => void;
}

const CardItem: React.FC<CardItemProps> = ({ card, onClick }) => {
  const maskCardNumber = (number: string) => {
    if (number.startsWith('ID-') || number.startsWith('DL-') || number.startsWith('MP-')) {
      return number;
    }
    return `**** **** **** ${number.slice(-4)}`;
  };

  const getCardColor = (categoryId: string) => {
    switch (categoryId) {
      case 'bank':
        return 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)'; // Dark navy
      case 'ids':
        return 'linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)'; // Deep blue
      case 'license':
        return 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)'; // Gray
      case 'transit':
        return 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)'; // Green
      case 'documents':
        return 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)';
      default:
        return 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)';
    }
  };

  const getVerificationStatusClass = (status: string) => {
    switch (status) {
      case 'verified': return 'verified';
      case 'failed': return 'failed';
      default: return 'pending';
    }
  };

  return (
    <div
      className="card-item"
      onClick={() => onClick(card)}
      style={{ background: getCardColor(card.categoryId) }}
    >
      <div className="card-front">
        <div className="card-chip"></div>
        <div className="card-number">{maskCardNumber(card.number)}</div>
        <div className="card-details">
          <span className="card-name">{card.name}</span>
          {card.expiry && <span className="card-expiry">{card.expiry}</span>}
        </div>
        <div className="card-holder">{card.cardHolder}</div>
      </div>
      {card.verifiedStatus && (
        <div className={`card-verification-status ${getVerificationStatusClass(card.verifiedStatus)}`}>
          {card.verifiedStatus}
        </div>
      )}
    </div>
  );
};

export default CardItem;

