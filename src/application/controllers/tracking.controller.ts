import { trackingService } from './../service/tracking.service';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { logger } from '../../logger';
class TrackingController {
  // Create a new tracking entry
  async createTracking(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;
      const tracking = await trackingService.createTracking(data);
      res.status(201).json(tracking);
    } catch (error) {
      logger.error('Error creating tracking', { error });
      res.status(500).json({ message: 'Error creating tracking' });
    }
  }

  // Get tracking by ID
  async getTrackingById(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const tracking = await trackingService.getTrackingById(new mongoose.Types.ObjectId(id));
      if (!tracking) return res.status(404).json({ message: 'Tracking not found' });
      res.status(200).json(tracking);
    } catch (error) {
      logger.error('Error fetching tracking', { error });
      res.status(500).json({ message: 'Error fetching tracking' });
    }
  }

  // Update tracking
  async updateTracking(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const tracking = await trackingService.updateTracking(new mongoose.Types.ObjectId(id), updateData);
      if (!tracking) return res.status(404).json({ message: 'Tracking not found' });
      res.status(200).json(tracking);
    } catch (error) {
      logger.error('Error updating tracking', { error });
      res.status(500).json({ message: 'Error updating tracking' });
    }
  }

  // Add tracking data (like location, speed, etc.)
  async addTrackingData(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const trackingData = req.body;
      const tracking = await trackingService.addTrackingData(new mongoose.Types.ObjectId(id), trackingData);
      if (!tracking) return res.status(404).json({ message: 'Tracking not found' });
      res.status(200).json(tracking);
    } catch (error) {
      logger.error('Error adding tracking data', { error });
      res.status(500).json({ message: 'Error adding tracking data' });
    }
  }

  // Update status (start, pause, resume, stop)
  async updateStatus(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const { event } = req.body;
      const tracking = await trackingService.updateStatus(new mongoose.Types.ObjectId(id), event);
      if (!tracking) return res.status(404).json({ message: 'Tracking not found' });
      res.status(200).json(tracking);
    } catch (error) {
      logger.error('Error updating status', { error });
      res.status(500).json({ message: 'Error updating status' });
    }
  }

  // Delete tracking entry
  async deleteTracking(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await trackingService.deleteTracking(new mongoose.Types.ObjectId(id));
      res.status(204).send();
    } catch (error) {
      logger.error('Error deleting tracking', { error });
      res.status(500).json({ message: 'Error deleting tracking' });
    }
  }
}

export const trackingController = new TrackingController();
