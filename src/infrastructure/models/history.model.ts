import mongoose, { Document, Schema } from 'mongoose';
import { ILocation, LocationSchema } from './location.model';

export interface IHistory extends Document {
  user_id: mongoose.Types.ObjectId;
  bike_id: string;
  rental_id:mongoose.Types.ObjectId;
  payment_id:mongoose.Types.ObjectId;
  tracking_id:mongoose.Types.ObjectId;
  created_at: Date;
}

const HistorySchema: Schema = new Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bike_id: { type: String, required: true },
  rental_id:{ type: mongoose.Schema.Types.ObjectId, ref: 'Rental', required: true },
  payment_id:{ type: mongoose.Schema.Types.ObjectId, ref: 'Payment', required: true },
  tracking_id:{ type: mongoose.Schema.Types.ObjectId, ref: 'Tracking', required: false },
  created_at: { type: Date, default: Date.now },
});

export const historyModel =  mongoose.model<IHistory>('History', HistorySchema);

