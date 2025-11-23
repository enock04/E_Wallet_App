import React, { useState } from 'react';
import { Card } from '../pages/Dashboard';

interface PossessionAuthModalProps {
  card: Card;
  onClose: () => void;
  onVerificationComplete: (success: boolean) => void;
}

const PossessionAuthModal: React.FC<PossessionAuthModalProps> = ({
  card,
  onClose,
  onVerificationComplete
}) => {
  const [step, setStep] = useState<'instructions' | 'recording' | 'processing' | 'result'>('instructions');
  const [verificationCode, setVerificationCode] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const generateCode = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/verification/generate-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ cardId: card.id })
      });

      if (response.ok) {
        const data = await response.json();
        setVerificationCode(data.code);
        setStep('recording');
      }
    } catch (error) {
      console.error('Error generating code:', error);
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    // In production, this would access camera and record video
    setTimeout(() => {
      setIsRecording(false);
      submitVerification();
    }, 3000); // Simulate 3-second recording
  };

  const submitVerification = async () => {
    setStep('processing');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/verification/verify/${card.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          code: verificationCode,
          videoUrl: 'simulated-video-url' // In production, upload actual video
        })
      });

      if (response.ok) {
        const data = await response.json();
        setResult({
          success: data.success,
          message: data.message
        });
        setStep('result');
        onVerificationComplete(data.success);
      }
    } catch (error) {
      console.error('Error submitting verification:', error);
      setResult({
        success: false,
        message: 'Verification failed. Please try again.'
      });
      setStep('result');
      onVerificationComplete(false);
    }
  };

  const renderInstructions = () => (
    <div className="verification-instructions">
      <h3>Verify Physical Possession</h3>
      <p>To verify you physically possess this card, you'll need to:</p>
      <ol>
        <li>Write down a verification code on paper</li>
        <li>Hold your physical card next to the code</li>
        <li>Record a short selfie video showing both</li>
      </ol>
      <div className="verification-requirements">
        <h4>Requirements:</h4>
        <ul>
          <li>Card must be clearly visible</li>
          <li>Code must be readable</li>
          <li>Face must be clearly visible</li>
          <li>Video should be 3-7 seconds long</li>
        </ul>
      </div>
      <div className="modal-actions">
        <button className="cancel-btn" onClick={onClose}>Cancel</button>
        <button className="add-card-btn" onClick={generateCode}>Start Verification</button>
      </div>
    </div>
  );

  const renderRecording = () => (
    <div className="verification-recording">
      <h3>Record Verification Video</h3>
      <div className="verification-code-display">
        <p>Your verification code:</p>
        <div className="code-box">{verificationCode}</div>
        <p>Write this code on paper and hold it next to your card.</p>
      </div>

      <div className="camera-preview">
        {isRecording ? (
          <div className="recording-indicator">
            <div className="recording-dot"></div>
            <p>Recording... Show your card and the code clearly.</p>
          </div>
        ) : (
          <div className="camera-placeholder">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" fill="currentColor"/>
            </svg>
            <p>Camera preview will appear here</p>
          </div>
        )}
      </div>

      <div className="modal-actions">
        <button className="cancel-btn" onClick={() => setStep('instructions')}>Back</button>
        <button
          className="add-card-btn"
          onClick={startRecording}
          disabled={isRecording}
        >
          {isRecording ? 'Recording...' : 'Start Recording'}
        </button>
      </div>
    </div>
  );

  const renderProcessing = () => (
    <div className="verification-processing">
      <div className="processing-spinner"></div>
      <h3>Processing Verification</h3>
      <p>Please wait while we verify your video...</p>
      <p>This may take a few moments.</p>
    </div>
  );

  const renderResult = () => (
    <div className="verification-result">
      <div className={`result-icon ${result?.success ? 'success' : 'error'}`}>
        {result?.success ? '✓' : '✗'}
      </div>
      <h3>{result?.success ? 'Verification Successful!' : 'Verification Failed'}</h3>
      <p>{result?.message}</p>
      {!result?.success && (
        <div className="retry-options">
          <p>You can try again or contact support for assistance.</p>
        </div>
      )}
      <div className="modal-actions">
        <button className="cancel-btn" onClick={onClose}>Close</button>
        {!result?.success && (
          <button className="add-card-btn" onClick={() => setStep('instructions')}>
            Try Again
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content verification-modal" onClick={(e) => e.stopPropagation()}>
        {step === 'instructions' && renderInstructions()}
        {step === 'recording' && renderRecording()}
        {step === 'processing' && renderProcessing()}
        {step === 'result' && renderResult()}
      </div>
    </div>
  );
};

export default PossessionAuthModal;
