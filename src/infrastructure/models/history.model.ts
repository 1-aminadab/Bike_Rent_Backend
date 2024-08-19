import mongoose, { Document, Schema } from 'mongoose';

export interface IHistory extends Document {
  user_id: mongoose.Types.ObjectId;
  bike_id: mongoose.Types.ObjectId;
  rental_details: {
    rental_id: mongoose.Types.ObjectId;
    start_time: Date;
    end_time?: Date;
    status: 'completed' | 'canceled';
    start_place_id: mongoose.Types.ObjectId;
    end_place_id?: mongoose.Types.ObjectId;
    route_id?: mongoose.Types.ObjectId;
    duration: number;
    total_distance: number;
    average_speed: number;
    maximum_speed: number;
    route_summary: {
      timestamp: Date;
      location: {
        longitude: number;
        latitude: number;
      };
      speed: number;
      battery_level: number;
      event: 'start' | 'pause' | 'resume' | 'stop' | 'incident';
    }[];
  };
  payment_details: {
    payment_id: mongoose.Types.ObjectId;
  };
  bike_status_at_end: {
    battery_level: number;
    bike_condition: 'good' | 'needs_service' | 'damaged';
    last_serviced: Date;
  };
  created_at: Date;
}

const HistorySchema: Schema = new Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bike_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Bike', required: true },
  rental_details: {
    rental_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Rental', required: true },
    start_time: { type: Date, required: true },
    end_time: { type: Date },
    status: { type: String, enum: ['completed', 'canceled'], required: true },
    start_place_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Place', required: true },
    end_place_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Place' },
    route_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Route' },
    duration: { type: Number },
    total_distance: { type: Number },
    average_speed: { type: Number },
    maximum_speed: { type: Number },
    route_summary: [
      {
        timestamp: { type: Date },
        location: {
          longitude: { type: Number, required: true },
          latitude: { type: Number, required: true },
        },
        speed: { type: Number },
        battery_level: { type: Number },
        event: { type: String, enum: ['start', 'pause', 'resume', 'stop', 'incident'] },
      },
    ],
  },
  payment_details: {
    payment_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment', required: true },
  },
  bike_status_at_end: {
    battery_level: { type: Number },
    bike_condition: { type: String, enum: ['good', 'needs_service', 'damaged'] },
    last_serviced: { type: Date },
  },
  created_at: { type: Date, default: Date.now },
});

export default mongoose.model<IHistory>('History', HistorySchema);

