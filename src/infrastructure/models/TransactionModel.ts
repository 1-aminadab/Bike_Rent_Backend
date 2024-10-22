// models/TransactionModel.ts
import { Schema, model, Document, Types } from 'mongoose';

enum TransactionStatus {
  Pending = 'pending',
  Success = 'success',
  Cancel = 'canceled'

}
// Define the interface for TypeScript
interface Transaction extends Document {
  user_id: Types.ObjectId;
  tx_ref: string;
  amount: number;
  status: TransactionStatus;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  created_at: Date;
  payment_method: string; // Added field for payment method
}


const TransactionSchema = new Schema<Transaction>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    tx_ref: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    status: { type: String, required: true , enum: Object.values(TransactionStatus), default:TransactionStatus.Pending},
    email: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    phone_number: { type: String, required: true },
    created_at:{type:Date, default:new Date() , required: true},
    payment_method: { type: String, required: true,default:"electronic" }, // cash or electronic
  },
  { timestamps: true }
);

export const TransactionModel = model<Transaction>('Transaction', TransactionSchema);
