import mongoose, { Schema, Document } from 'mongoose';

interface IBike extends Document {
  bikeId: string;
  qrCode: string;
  Type:string;
  status: boolean;
  location: mongoose.Types.ObjectId,
  inUse: boolean;
}

const BikeSchema: Schema = new Schema({
  bikeId: { type: String, required: true, unique: true },
  type:{type:String,required:false,default:"manual"},
  qrCode: { type: String, required: true,unique:true },
  status: { type: Boolean, required: true, default: true },
  inUse: { type: Boolean, required: true, default: false },
  location: {type: mongoose.Types.ObjectId, ref:"Place" }
});

export const BikeModel = mongoose.model<IBike>('Bike', BikeSchema);
