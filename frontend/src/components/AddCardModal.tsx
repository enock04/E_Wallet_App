import React, { useState } from 'react';
import { Category, Card } from '../pages/Dashboard';

interface AddCardModalProps {
  categories: Category[];
  onAdd: (card: Omit<Card, 'id'> & { imageFile?: File }) => void;
  onClose: () => void;
  mode: 'card' | 'document';
}

const AddCardModal: React.FC<AddCardModalProps> = ({ categories, onAdd, onClose, mode }) => {
  const [name, setName] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [number, setNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [issuer, setIssuer] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && number && categoryId) {
      onAdd({ name, number, expiry, categoryId, cardHolder, issuer, imageFile: mode === 'document' ? imageFile || undefined : undefined });
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{mode === 'document' ? 'Add New Document' : 'Add New Card'}</h2>
          <p>Add a new {mode === 'document' ? 'document' : 'card'} to your digital wallet</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{mode === 'document' ? 'Document Type:' : 'Card Type:'}</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              <option value="">Select {mode === 'document' ? 'Document' : 'Card'} Type</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>{mode === 'document' ? 'Document Name:' : 'Card Name:'}</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={mode === 'document' ? 'e.g., Passport' : 'e.g., Platinum Card'}
              required
            />
          </div>
          <div className="form-group">
            <label>{mode === 'document' ? 'Document Holder:' : 'Card Holder:'}</label>
            <input
              type="text"
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value)}
              placeholder={mode === 'document' ? 'e.g., John Doe' : 'e.g., John Doe'}
              required
            />
          </div>
          <div className="form-group">
            <label>{mode === 'document' ? 'Document Number:' : 'Card/ID Number:'}</label>
            <input
              type="text"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder={mode === 'document' ? 'e.g., 123456789' : 'e.g., **** 4242'}
              required
            />
          </div>

          {mode === 'card' && (
            <>
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
            </>
          )}

          {mode === 'document' && (
            <div className="form-group">
              <label>Upload Document Image:</label>
              <input type="file" accept="image/*" onChange={handleImageChange} />
              {previewUrl && <img src={previewUrl} alt="Preview" style={{ marginTop: '10px', maxWidth: '100%', maxHeight: '200px' }} />}
            </div>
          )}

          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="add-card-btn">
              {mode === 'document' ? 'Add Document' : 'Add Card'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

