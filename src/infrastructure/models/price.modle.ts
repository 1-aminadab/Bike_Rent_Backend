import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IPrice extends Document {
  _id: Types.ObjectId;
  pricePerMinute: number;
  initialPrice?: number; // New field for initial price
  routeId?: Types.ObjectId;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const PriceSchema: Schema = new Schema(
  {
    pricePerMinute: { type: Number, required: true },
    initialPrice: { type: Number, required: false },
    description: { type: String, required: false },
    routeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: false },
  },
  { timestamps: true } // Automatically handle createdAt and updatedAt
);

// Create and export the price model
export default mongoose.model<IPrice>('PriceModel', PriceSchema);