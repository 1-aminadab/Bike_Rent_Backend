import { logger } from './../../logger';
import trackingModel from '../../infrastructure/models/tracking.model';
import mongoose from 'mongoose';
import { ITrackingData, ITracking } from '../../infrastructure/models/tracking.model';
class TrackingService {
  // Create a new tracking entry
  async createTracking(data: Partial<ITracking>): Promise<ITracking> {
    try {
      const tracking = new trackingModel(data);
      return await tracking.save();
    } catch (error) {
      logger.error('Error creating tracking data', { error });
      throw new Error('Could not create tracking data');
    }
  }

  // Get tracking data by ID
  async getTrackingById(id: mongoose.Types.ObjectId): Promise<ITracking | null> {
    try {
      return await trackingModel.findById(id);
    } catch (error) {
      logger.error(`Error fetching tracking data for ID: ${id}`, { error });
      throw new Error('Could not fetch tracking data');
    }
  }
  
  // Get tracking data by ID
  async getAllTracking(): Promise<ITracking[] | null> {
    try {
      return await trackingModel.find();
    } catch (error) {
      logger.error(`Error fetching tracking data for ID: `, { error });
      throw new Error('Could not fetch tracking data');
    }
  }

  
  // Update tracking data
  async updateTracking(id: mongoose.Types.ObjectId, updateData: Partial<ITracking>): Promise<ITracking | null> {
    try {
      return await trackingModel.findByIdAndUpdate(id, updateData, { new: true });
    } catch (error) {
      logger.error(`Error updating tracking data for ID: ${id}`, { error });
      throw new Error('Could not update tracking data');
    }
  }

  // Add tracking data (e.g., new location, speed, etc.)
  async addTrackingData(id: mongoose.Types.ObjectId, trackingData: ITrackingData): Promise<ITracking | null> {
    try {
      const tracking = await trackingModel.findById(id);
      if (!tracking) throw new Error('Tracking not found');

      tracking.tracking_data.push(trackingData);
      return await tracking.save();
    } catch (error) {
      logger.error(`Error adding tracking data for ID: ${id}`, { error });
      throw new Error('Could not add tracking data');
    }
  }

  // Delete tracking entry
  async deleteTracking(id: mongoose.Types.ObjectId): Promise<void> {
    try {
      await trackingModel.findByIdAndDelete(id);
    } catch (error) {
      logger.error(`Error deleting tracking data for ID: ${id}`, { error });
      throw new Error('Could not delete tracking data');
    }
  }

  // Update status (start, pause, resume, stop)
  async updateStatus(id: mongoose.Types.ObjectId, event: 'start' | 'pause' | 'resume' | 'stop'): Promise<ITracking | null> {
    try {
      const tracking = await trackingModel.findById(id);
      if (!tracking) throw new Error('Tracking not found');

      const latestData = tracking.tracking_data[tracking.tracking_data.length - 1];
      latestData.event = event;
      tracking.tracking_data[tracking.tracking_data.length - 1] = latestData;

      return await tracking.save();
    } catch (error) {
      logger.error(`Error updating tracking status for ID: ${id}`, { error });
      throw new Error('Could not update tracking status');
    }
  }
}

export const trackingService = new TrackingService();
