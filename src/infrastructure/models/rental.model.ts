import mongoose, { Document, Schema } from 'mongoose';

export interface IRental extends Document {
  user_id: mongoose.Types.ObjectId;
  assigned_by: mongoose.Types.ObjectId;
  bike_id: mongoose.Types.ObjectId;
  start_time: Date;
  end_time?: Date;
  status: 'waiting' | 'ongoing' | 'completed' | 'canceled';
  start_place_id: mongoose.Types.ObjectId;
  end_place_id?: mongoose.Types.ObjectId;
  start_place_admin?:mongoose.Types.ObjectId;
  end_place_admin?:mongoose.Types.ObjectId;
  route_id?: mongoose.Types.ObjectId;
  created_at: Date;
  updated_at: Date;
}
 
const RentalSchema: Schema = new Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  assigned_by: { type: mongoose.Schema.Types.ObjectId, required: true },
  bike_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  start_time: { type: Date, required: true },
  end_time: { type: Date },
  status: { type: String, enum: ['waiting', 'ongoing', 'completed', 'canceled'], required: true },
  start_place_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  end_place_id: { type: mongoose.Schema.Types.ObjectId },
  route_id: { type: mongoose.Schema.Types.ObjectId },
  start_place_admin:{type: mongoose.Types.ObjectId, required: false},
  end_place_admin:{type: mongoose.Types.ObjectId, required: false},
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

export default mongoose.model<IRental>('Rental', RentalSchema);
