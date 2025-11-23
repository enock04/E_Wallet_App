import React from 'react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  user: string | null;
  onLogout: () => void;
  onAddCard: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, onAddCard }) => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-title">
          <h1>Digital Wallet</h1>
          <p>Manage all your cards & documents</p>
        </div>
        <div className="header-actions">
          <Link to="/profile" style={{ textDecoration: 'none' }}>
            <button className="add-card-btn" style={{ marginRight: '10px' }}>
              👤 Profile
            </button>
          </Link>
          <Link to="/payment" style={{ textDecoration: 'none' }}>
            <button className="payment-nav-btn" style={{ marginRight: '10px' }}>
              💳 Make Payment
            </button>
          </Link>
          <button className="add-card-btn" onClick={onAddCard}>
            + Add Card
          </button>
        </div>
      </div>
    </header>
  );
};
export default Header;
