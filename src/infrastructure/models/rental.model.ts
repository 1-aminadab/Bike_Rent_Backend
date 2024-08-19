import mongoose, { Document, Schema } from 'mongoose';

export interface IRental extends Document {
  user_id: mongoose.Types.ObjectId;
  bike_id: mongoose.Types.ObjectId;
  start_time: Date;
  end_time?: Date;
  status: 'ongoing' | 'completed' | 'canceled';
  start_place_id: mongoose.Types.ObjectId;
  end_place_id?: mongoose.Types.ObjectId;
  route_id?: mongoose.Types.ObjectId;
  created_at: Date;
  updated_at: Date;
}

const RentalSchema: Schema = new Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bike_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Bike', required: true },
  start_time: { type: Date, required: true },
  end_time: { type: Date },
  status: { type: String, enum: ['ongoing', 'completed', 'canceled'], required: true },
  start_place_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Place', required: true },
  end_place_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Place' },
  route_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Route' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

export default mongoose.model<IRental>('Rental', RentalSchema);
