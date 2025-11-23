import mongoose, { Document, Schema } from 'mongoose';

export interface ICard extends Document {
  name: string;
  number: string;
  expiry: string;
  categoryId: string;
  cardHolder: string;
  issuer: string;
  userId: string;
  verifiedStatus: 'pending' | 'verified' | 'failed';
  verificationDate?: Date;
  tokenId?: string; // For tokenized bank cards
  createdAt: Date;
}

const CardSchema: Schema = new Schema({
  name: {
    type: String,
    required: true
  },
  number: {
    type: String,
    required: true
  },
  expiry: {
    type: String,
    default: ''
  },
  categoryId: {
    type: String,
    required: true
  },
  cardHolder: {
    type: String,
    default: ''
  },
  issuer: {
    type: String,
    default: ''
  },
  userId: {
    type: String,
    required: true
  },
  verifiedStatus: {
    type: String,
    enum: ['pending', 'verified', 'failed'],
    default: 'pending'
  },
  verificationDate: {
    type: Date
  },
  tokenId: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<ICard>('Card', CardSchema);
