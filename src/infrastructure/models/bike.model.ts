import mongoose, { Schema, Document } from 'mongoose';

interface IBike extends Document {
  bikeId: string;
  isAvailable: boolean;
  location: {
    latitude: number;
    longitude: number;
  };
  inUse: boolean;
}

const BikeSchema: Schema = new Schema({
  bikeId: { type: String, required: true, unique: true },
  isAvailable: { type: Boolean, required: true, default: true },
  
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  inUse: { type: Boolean, required: true, default: false }
});

export const BikeModel = mongoose.model<IBike>('Bike', BikeSchema);
