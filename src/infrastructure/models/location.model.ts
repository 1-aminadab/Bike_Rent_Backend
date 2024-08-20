import mongoose, { Document, Schema } from 'mongoose';

export interface ILocation {
    longitude: number;
    latitude: number;
}

export const LocationSchema: Schema = new Schema({
    longitude: { type: Number, required: true },
    latitude: { type: Number, required: true },
  });
export default mongoose.model<ILocation>('Location', LocationSchema);