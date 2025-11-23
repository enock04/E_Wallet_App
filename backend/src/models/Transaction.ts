import mongoose, { Document, Schema } from 'mongoose';


export interface ITransaction extends Document {
  _id: mongoose.Types.ObjectId;
  cardId: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  date: Date;
  merchant?: string;
  balance?: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed';
  paymentId?: string; // Reference to payment if this is a payment transaction
}

const TransactionSchema: Schema = new Schema({
  cardId: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['credit', 'debit'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  merchant: {
    type: String
  },
  balance: {
    type: Number
  },
  currency: {
    type: String,
    default: 'RWF'
  },
  status: {
    type: String,
    enum: ['completed', 'pending', 'failed'],
    default: 'completed'
  },
  paymentId: {
    type: String
  }
});

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);
