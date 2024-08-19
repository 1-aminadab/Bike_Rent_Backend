import mongoose, { Document, Schema } from 'mongoose';

export interface IBike extends Document {
  model: string;
  status: 'available' | 'rented' | 'maintenance';
  current_location: {
    longitude: number;
    latitude: number;
  };
  battery_level?: number;
  last_serviced?: Date;
  created_at: Date;
  updated_at: Date;
}

const BikeSchema: Schema = new Schema({
  model: { type: String },
  status: { type: String, enum: ['available', 'rented', 'maintenance'], required: true },
  current_location: {
    longitude: { type: Number, required: true },
    latitude: { type: Number, required: true },
  },
  battery_level: { type: Number },
  last_serviced: { type: Date },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

export default mongoose.model<IBike>('Bike', BikeSchema);
