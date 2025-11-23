import mongoose, { Document, Schema } from 'mongoose';

export interface ILoginOTP extends Document {
  userId: string;
  otpCode: string;
  expiresAt: Date;
  used: boolean;
  createdAt: Date;
}

const LoginOTPSchema: Schema = new Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  otpCode: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 } // TTL index handled by MongoDB for auto deletion
  },
  used: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<ILoginOTP>('LoginOTP', LoginOTPSchema);
