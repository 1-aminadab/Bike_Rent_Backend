import mongoose, { Document, Schema } from 'mongoose';
import { ILocation } from './location.model';
import { LocationSchema } from './location.model';

export interface IRoutePath {
  timestamp: Date;
  location: ILocation;
  event: 'start' | 'pause' | 'resume' | 'stop';
}

export interface IRoute extends Document {
  start_place_id: mongoose.Types.ObjectId;
  end_place_id: mongoose.Types.ObjectId;
  distance: number;
  estimated_duration: number;
  route_path: IRoutePath[];
  created_at: Date;
}

const RouteSchema: Schema = new Schema({
  start_place_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Place', required: true },
  end_place_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Place', required: true },
  distance: { type: Number },
  estimated_duration: { type: Number },
  route_path: [
    {
      name: { type: String, require: false},
      location: LocationSchema,
    },
  ],
  created_at: { type: Date, default: Date.now },
});

export default mongoose.model<IRoute>('Route', RouteSchema);
