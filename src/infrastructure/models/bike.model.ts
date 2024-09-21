import mongoose, { Schema, Document } from 'mongoose';

interface IBike extends Document {
  bikeId: string;
  qrCode: string;
  Type:string;
  status: boolean;
  location: {
    latitude: number;
    longitude: number;
  };
  inUse: boolean;
}

const BikeSchema: Schema = new Schema({
  bikeId: { type: String, required: true, unique: true },
  type:{type:String,required:false,default:"manual"},
  qrCode: { type: String, required: true,unique:true },
  status: { type: Boolean, required: true, default: true },
  inUse: { type: Boolean, required: true, default: false },
  location: {
    latitude: { type: Number, required: false },
    longitude: { type: Number, required: false },
  },
});

export const BikeModel = mongoose.model<IBike>('Bike', BikeSchema);
