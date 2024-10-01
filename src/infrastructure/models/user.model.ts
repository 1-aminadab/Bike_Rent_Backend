import mongoose, { Schema } from 'mongoose';
import { UserRole } from '../../domain/enums/user.enum';
import { IUser } from '../../domain/interface/user.interface';
import { add } from 'winston';

const UserSchema: Schema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  nationalIdNumber: { type: String, required: true, unique: true },
  email: { type: String, required: false, unique: true },
  refreshToken: { type: String, required: false },
  password: { type: String, required: true },
  verified: { type: Boolean, default: false },
  status:{type:Boolean, default: true},
  address: { type: String, required: false },
  age: { type: Number, required: false },
  gender : { type: String, required: false },
  role: { type: String, enum: Object.values(UserRole) }
}, {
  timestamps: true
});

export default mongoose.model<IUser>('User', UserSchema);