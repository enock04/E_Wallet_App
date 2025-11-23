import mongoose, { Document, Schema } from 'mongoose';


export interface IVerificationRecord extends Document {
  cardId: string;
  method: 'selfie_video' | 'otp' | 'biometric';
  result: 'passed' | 'failed' | 'pending_review';
  timestamp: Date;
  reviewerId?: string; // For manual review
  evidenceUrl?: string; // Compressed video/image evidence
  notes?: string;
}

const VerificationRecordSchema: Schema = new Schema({
  cardId: {
    type: String,
    required: true
  },
  method: {
    type: String,
    enum: ['selfie_video', 'otp', 'biometric'],
    required: true
  },
  result: {
    type: String,
    enum: ['passed', 'failed', 'pending_review'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  reviewerId: {
    type: String
  },
  evidenceUrl: {
    type: String
  },
  notes: {
    type: String
  }
});

export default mongoose.model<IVerificationRecord>('VerificationRecord', VerificationRecordSchema);
