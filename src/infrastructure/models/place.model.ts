import mongoose, { Document, Schema } from 'mongoose';

export interface ILocation {
    longitude: number;
    latitude: number;
}

export interface IPlace extends Document {
    name: string;
    location: ILocation;
    address?: string;
    created_at: Date;
}

const PlaceSchema: Schema = new Schema({
    name: { type: String, required: true },
    location: {
      longitude: { type: Number, required: true },
      latitude: { type: Number, required: true },
    },
    address: { type: String },
    created_at: { type: Date, default: Date.now },
  });
  
  export default mongoose.model<IPlace>('Place', PlaceSchema)