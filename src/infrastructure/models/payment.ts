import mongoose, { Document, Schema } from 'mongoose';

export interface IPayment extends Document {
  rental_id: mongoose.Types.ObjectId;
  user_id: mongoose.Types.ObjectId;
  amount: number;
  payment_method: 'credit_card' | 'paypal' | 'apple_pay' | 'google_pay';
  status: 'completed' | 'failed';
  transaction_id?: string;
  payment_timestamp: Date;
}

const PaymentSchema: Schema = new Schema({
  rental_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Rental', required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  payment_method: { type: String, enum: ['credit_card', 'paypal', 'apple_pay', 'google_pay'], required: true },
  status: { type: String, enum: ['completed', 'failed'], required: true },
  transaction_id: { type: String },
  payment_timestamp: { type: Date, default: Date.now },
});

export default mongoose.model<IPayment>('Payment', PaymentSchema);
