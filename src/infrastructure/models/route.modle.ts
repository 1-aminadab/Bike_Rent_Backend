import mongoose, { Document, Schema } from 'mongoose';
import { ILocation } from './place.model';

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
      timestamp: { type: Date, default: Date.now },
      location: {
        longitude: { type: Number, required: true },
        latitude: { type: Number, required: true },
      },
      event: { type: String, enum: ['start', 'pause', 'resume', 'stop'], required: true },
    },
  ],
  created_at: { type: Date, default: Date.now },
});

export default mongoose.model<IRoute>('Route', RouteSchema);
