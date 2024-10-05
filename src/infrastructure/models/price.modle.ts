import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IPrice extends Document {
  _id: Types.ObjectId;
  pricePerMinute: number;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const PriceSchema: Schema = new Schema(
  {
    pricePerMinute: { type: Number, required: true },
    description: { type: String, required: false },
  },
  { timestamps: true } // Automatically handle createdAt and updatedAt
);

// Create and export the price model
export default mongoose.model<IPrice>('PriceModel', PriceSchema);
