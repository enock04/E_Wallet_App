import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import { Card, Category } from '../pages/Dashboard';

interface ScanCardModalProps {
  categories: Category[];
  onScanComplete: (scannedCardData: Omit<Card, 'id'>) => void;
  onClose: () => void;
}

const videoConstraints = {
  facingMode: 'environment',
};

const ScanCardModal: React.FC<ScanCardModalProps> = ({ categories, onScanComplete, onClose }) => {
  const webcamRef = useRef<Webcam>(null);
  const [scannedData, setScannedData] = useState<Omit<Card, 'id'>>({
    name: '',
    number: '',
    expiry: '',
    categoryId: '',
    cardHolder: '',
    issuer: '',
  });
  const [step, setStep] = useState<'camera' | 'review'>('camera');

  // Mock scanning logic: capture still image on button press and simulate scan data entry
  const capture = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      console.log('Captured image source:', imageSrc);
      // In real use, perform OCR or scan here and populate fields
      // For demo, prompt user to enter scanned data in form
      setStep('review');
      setScannedData(prev => ({
        ...prev,
        name: 'Scanned Card',
        number: '1234 5678 9012 3456',
        expiry: '12/25',
        categoryId: categories.length > 0 ? categories[0].id : '',
        cardHolder: 'John Doe',
        issuer: 'Visa',
      }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setScannedData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onScanComplete(scannedData);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {step === 'camera' && (
          <div>
            <h2>Scan Your Card</h2>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              style={{ width: '100%' }}
            />
            <button onClick={capture} className="scan-btn" style={{ marginTop: '10px' }}>
              Capture
            </button>
          </div>
        )}
        {step === 'review' && (
          <form onSubmit={handleSubmit}>
            <h2>Review Scanned Data</h2>
            <div className="form-group">
              <label>Card Type:</label>
              <select
                name="categoryId"
                value={scannedData.categoryId}
                onChange={handleChange}
                required
              >
                <option value="">Select Card Type</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Card Name:</label>
              <input
                type="text"
                name="name"
                value={scannedData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Card Holder:</label>
              <input
                type="text"
                name="cardHolder"
                value={scannedData.cardHolder}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Card Number:</label>
              <input
                type="text"
                name="number"
                value={scannedData.number}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Expiry Date:</label>
              <input
                type="text"
                name="expiry"
                value={scannedData.expiry}
                onChange={handleChange}
                placeholder="MM/YY"
              />
            </div>
            <div className="form-group">
              <label>Issuer:</label>
              <input
                type="text"
                name="issuer"
                value={scannedData.issuer}
                onChange={handleChange}
              />
            </div>
            <div className="modal-actions">
              <button type="button" className="cancel-btn" onClick={() => setStep('camera')}>
                Back
              </button>
              <button type="submit" className="add-card-btn">
                Save Card
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ScanCardModal;
