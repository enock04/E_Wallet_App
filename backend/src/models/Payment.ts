import mongoose, { Document, Schema } from 'mongoose';

export interface IPayment extends Document {
  _id: mongoose.Types.ObjectId;
  fromCardId: string;
  to: string; // Phone, email, or QR code recipient
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed';
  method: 'manual' | 'scan';
  createdAt: Date;
  completedAt?: Date;
  transactionId?: string; // Reference to the debit transaction
}

const PaymentSchema: Schema = new Schema({
  fromCardId: {
    type: String,
    required: true
  },
  to: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'RWF'
  },
  status: {
    type: String,
    enum: ['completed', 'pending', 'failed'],
    default: 'pending'
  },
  method: {
    type: String,
    enum: ['manual', 'scan'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  completedAt: {
    type: Date
  },
  transactionId: {
    type: String
  }
});

export default mongoose.model<IPayment>('Payment', PaymentSchema);
