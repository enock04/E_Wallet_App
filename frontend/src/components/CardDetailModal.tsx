import React, { useState, useEffect } from 'react';
import { Card } from '../pages/Dashboard';
import { useAuth } from '../context/AuthContext';
import PossessionAuthModal from './PossessionAuthModal';


interface Transaction {
  id: string;
  cardId: string;
  userId: string;
  date: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
  merchant?: string;
  category?: string;
  createdAt: string;
}

interface PaginatedTransactions {
  transactions: Transaction[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalTransactions: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

interface CardDetailModalProps {
  card: Card;
  onClose: () => void;
}

const CardDetailModal: React.FC<CardDetailModalProps> = ({ card, onClose }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showVerification, setShowVerification] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginatedTransactions['pagination'] | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchTransactions = async () => {
      if (card.categoryId === 'bank') {
        try {
          const response = await fetch(`http://localhost:5000/api/transactions/card/${card.id}?page=${currentPage}&limit=5`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const data: PaginatedTransactions = await response.json();
            setTransactions(data.transactions);
            setPagination(data.pagination);
          } else {
            console.error('Failed to fetch transactions');
          }
        } catch (error) {
          console.error('Error fetching transactions:', error);
        }
      }
      setLoading(false);
    };

    fetchTransactions();
  }, [card.categoryId, card.id, token, currentPage]);

  const handleVerificationComplete = (success: boolean) => {
    setShowVerification(false);
    if (success) {
      // Refresh card data to show updated verification status
      window.location.reload();
    }
  };

  const canVerify = card.categoryId === 'bank' && (!card.verifiedStatus || card.verifiedStatus === 'pending' || card.verifiedStatus === 'failed');

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <h2>Card Details</h2>
          <div className="card-detail">
            <p><strong>Name:</strong> {card.name}</p>
            <p><strong>Card Holder:</strong> {card.cardHolder || 'N/A'}</p>
            <p><strong>Number:</strong> {card.number}</p>
            <p><strong>Expiry:</strong> {card.expiry || 'N/A'}</p>
            <p><strong>Issuer:</strong> {card.issuer || 'N/A'}</p>
            {card.verifiedStatus && (
              <p><strong>Verification Status:</strong>
                <span className={`verification-status ${card.verifiedStatus}`}>
                  {card.verifiedStatus}
                </span>
              </p>
            )}
            {card.verificationDate && (
              <p><strong>Verified On:</strong> {new Date(card.verificationDate).toLocaleDateString()}</p>
            )}
          </div>

          {card.categoryId === 'bank' && (
            <div className="transactions-section">
              <h3>Transaction History</h3>
              {loading ? (
                <p>Loading transactions...</p>
              ) : transactions.length > 0 ? (
                <>
                  <div className="transactions-list">
                    {transactions.map((transaction) => (
                      <div key={transaction.id} className={`transaction-item ${transaction.type}`}>
                        <div className="transaction-info">
                          <span className="transaction-date">{transaction.date}</span>
                          <span className="transaction-description">{transaction.description}</span>
                        </div>
                        <span className={`transaction-amount ${transaction.type}`}>
                          {transaction.type === 'credit' ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                  {pagination && pagination.totalPages > 1 && (
                    <div className="pagination-controls">
                      <button
                        onClick={() => setCurrentPage(prev => prev - 1)}
                        disabled={!pagination.hasPrev}
                        className="pagination-btn"
                      >
                        Previous
                      </button>
                      <span className="pagination-info">
                        Page {pagination.currentPage} of {pagination.totalPages}
                      </span>
                      <button
                        onClick={() => setCurrentPage(prev => prev + 1)}
                        disabled={!pagination.hasNext}
                        className="pagination-btn"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <p>No transactions found.</p>
              )}
            </div>
          )}

          <div className="modal-actions">
            <button className="close-btn" onClick={onClose}>
              Close
            </button>
            {canVerify && (
              <button className="add-card-btn" onClick={() => setShowVerification(true)}>
                Verify Card
              </button>
            )}
          </div>
        </div>
      </div>

      {showVerification && (
        <PossessionAuthModal
          card={card}
          onClose={() => setShowVerification(false)}
          onVerificationComplete={handleVerificationComplete}
        />
      )}
    </>
  );
};

export default CardDetailModal;
