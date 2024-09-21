import { Document } from 'mongoose';

export interface IBike extends Document {
    bikeId: string;
    qrCode: string;
    status: boolean;
    inUse: boolean;
    location: {
      latitude: number;
      longitude: number;
    };
  }