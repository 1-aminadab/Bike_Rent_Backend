import mongoose, { Document, Schema } from 'mongoose';
import { ILocation, LocationSchema } from './location.model';
export interface IPlace extends Document {
    name: string;
    location: ILocation;
    address?: string;
    created_at: Date;
    admin_id:mongoose.Types.ObjectId
}

const PlaceSchema: Schema = new Schema({
    name: { type: String, required: true },
    location: LocationSchema,
    address: { type: String },
    admin_id:{ type: mongoose.Types.ObjectId, required: false},
    created_at: { type: Date, default: Date.now },
  });
  
  export default mongoose.model<IPlace>('Place', PlaceSchema)