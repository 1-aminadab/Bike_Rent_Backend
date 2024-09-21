// models/TransactionModel.ts
import { Schema, model, Document, Types } from 'mongoose';

// Define the interface for TypeScript
interface Transaction extends Document {
  user_id: Types.ObjectId;
  tx_ref: string;
  amount: number;
  status: string;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
}

// Define the schema
const TransactionSchema = new Schema<Transaction>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    tx_ref: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    status: { type: String, required: true },
    email: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    phone_number: { type: String, required: true },
  },
  { timestamps: true }
);

// Create and export the model
export const TransactionModel = model<Transaction>('Transaction', TransactionSchema);
