import React, { useState } from 'react';
import { Category, Card } from '../pages/Dashboard.tsx';

interface AddCardModalProps {
  categories: Category[];
  onAdd: (card: Omit<Card, 'id'>) => void;
  onClose: () => void;
}

const AddCardModal: React.FC<AddCardModalProps> = ({ categories, onAdd, onClose }) => {
  const [name, setName] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [number, setNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [issuer, setIssuer] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && number && categoryId) {
      onAdd({ name, number, expiry, categoryId });
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add New Card</h2>
          <p>Add a new card or document to your digital wallet</p>
        </div>

        <div className="upload-options">
          <button type="button" className="upload-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" fill="currentColor"/>
            </svg>
            Upload Image
          </button>
          <button type="button" className="scan-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4,4H10V10H4V4M20,4V10H14V4H20M14,15H16V13H14V11H16V13H18V11H20V13H18V15H16V13H14V15M16,20H18V18H20V20H18V22H16V20M4,20V14H10V20H4M6,6V8H8V6H6M16,6V8H18V6H16M6,16V18H8V16H6Z" fill="currentColor"/>
            </svg>
            Scan Card
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Card Type:</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              <option value="">Select Card Type</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Card Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Platinum Card"
              required
            />
          </div>
          <div className="form-group">
            <label>Card Holder:</label>
            <input
              type="text"
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value)}
              placeholder="e.g., John Doe"
              required
            />
          </div>
          <div className="form-group">
            <label>Card/ID Number:</label>
            <input
              type="text"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder="e.g., **** 4242"
              required
            />
          </div>
          <div className="form-group">
            <label>Expiry Date:</label>
            <input
              type="text"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              placeholder="MM/YY"
            />
          </div>
          <div className="form-group">
            <label>Issuer:</label>
            <input
              type="text"
              value={issuer}
              onChange={(e) => setIssuer(e.target.value)}
              placeholder="e.g., Visa"
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="add-card-btn">
              Add Card
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCardModal;