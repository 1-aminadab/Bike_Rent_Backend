import mongoose, { Document, Schema } from 'mongoose';
import { ILocation, LocationSchema } from './location.model';

export interface IHistory extends Document {
  user_id: mongoose.Types.ObjectId;
  bike_id: string;
  rental_details: {
    rental_id: mongoose.Types.ObjectId;
    end_time?: Date;
    status: 'completed' | 'canceled';
    end_place_id?: mongoose.Types.ObjectId;
    duration: number;
    total_distance: number;
    average_speed: number;
    maximum_speed: number;
    route_summary: {
      timestamp: Date;
      location: ILocation;
      speed: number;
      event: 'start' | 'pause' | 'resume' | 'stop' | 'incident';
    }[];
  };
  payment_details: {
    payment_id: mongoose.Types.ObjectId;
  };
  bike_status_at_end: {
    battery_level: number;
    bike_condiroutertion: 'good' | 'needs_service' | 'damaged';
    last_serviced: Date;
  };
  created_at: Date;
}

const HistorySchema: Schema = new Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bike_id: { type: String, ref: 'Bike', required: true },
  rental_details: {
    rental_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Rental', required: true },
    end_time: { type: Date },
    status: { type: String, enum: ['completed', 'canceled'], required: true },
    duration: { type: Number },
    total_distance: { type: Number },
    average_speed: { type: Number },
    maximum_speed: { type: Number },
    route_summary: [
      {
        timestamp: { type: Date },
        location: LocationSchema,
        speed: { type: Number },
        event: { type: String, enum: ['start', 'pause', 'resume', 'stop', 'incident'] },
      },
    ],
  },
  payment_details: {
    payment_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment', required: true },
  },
  bike_status_at_end: {
    bike_condition: { type: String, enum: ['good', 'needs_service', 'damaged'] },
    last_serviced: { type: Date },
  },
  created_at: { type: Date, default: Date.now },
});

export const historyModel =  mongoose.model<IHistory>('History', HistorySchema);

