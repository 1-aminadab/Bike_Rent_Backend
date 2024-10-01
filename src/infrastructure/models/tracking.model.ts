import mongoose, { Document, Schema } from 'mongoose';
import { ILocation } from './location.model';

export interface ITrackingData {
  timestamp: Date;
  location: ILocation;
  speed?: number;
  event: 'start' | 'pause' | 'resume' | 'stop';
  distance_travelled?: number;
}

export interface ITracking extends Document {
  rental_id: mongoose.Types.ObjectId;
  bike_id: mongoose.Types.ObjectId;
  user_id: mongoose.Types.ObjectId;
  route_id?: mongoose.Types.ObjectId;
  tracking_data: ITrackingData[];
  route_summary: {
    total_distance: number;
    average_speed: number;
    maximum_speed: number;
    total_duration: number;
  };
}

const TrackingSchema: Schema = new Schema({
  rental_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Rental', required: true },
  bike_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Bike', required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  route_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Route' },
  tracking_data: [
    {
      timestamp: { type: Date, default: Date.now, required: true },
      location: {
        longitude: { type: Number, required: false },
        latitude: { type: Number, required: false },
      },
      speed: { type: Number },
      event: { type: String, enum: ['start', 'pause', 'resume', 'stop', 'incident'], default: 'start' },
      distance_travelled: { type: Number },
    },
  ],
  route_summary: {
    total_distance: { type: Number, required: false},
    average_speed: { type: Number, required: false},
    maximum_speed: { type: Number, required: false},
    total_duration: { type: Number, required: false},
  },
});

export default mongoose.model<ITracking>('Tracking', TrackingSchema);
