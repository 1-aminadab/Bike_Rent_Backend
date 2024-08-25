import mongoose, { Document, Schema } from 'mongoose';
import { ILocation, LocationSchema } from './location.model';


export interface IBike extends Document {
  bikeModel: string;
  status: 'available' | 'rented' | 'maintenance';
  current_location: ILocation;
  battery_level?: number;
  last_serviced?: Date;
  created_at: Date;
  updated_at: Date;
}

const BikeSchema: Schema = new Schema({
  bikeModel: { type: String },
  status: { type: String, enum: ['available', 'rented', 'maintenance'], required: true },
  current_location: LocationSchema,
  battery_level: { type: Number },
  last_serviced: { type: Date },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

export default mongoose.model<IBike>('Bike', BikeSchema);
