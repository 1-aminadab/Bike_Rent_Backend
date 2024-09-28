import { Request, Response } from 'express';
import { PlaceService } from '../service/place.service';
import { logger } from '../../logger';

const placeService = new PlaceService();

export class PlaceController {

  // Create a new place
  async createPlace(req: Request, res: Response): Promise<void> {
    try {
      const place = await placeService.createPlace(req.body);
      res.status(201).json(place);
    } catch (error) {
      logger.error('Failed to create place', { error });
      res.status(500).json({ error: 'Failed to create place' });
    }
  }

  // Get place by ID
  async getPlaceById(req: Request, res: Response): Promise<void> {
    try {
      const place = await placeService.getPlaceById(req.params.id);
      if (!place) {
        res.status(404).json({ error: 'Place not found' });
        return;
      }
      res.status(200).json(place);
    } catch (error) {
      logger.error('Failed to get place', { error });
      res.status(500).json({ error: 'Failed to get place' });
    }
  }

  // Get all places
  async getAllPlaces(_req: Request, res: Response): Promise<void> {
    try {
      const places = await placeService.getAllPlaces();
      res.status(200).json(places);
    } catch (error) {
      logger.error('Failed to get all places', { error });
      res.status(500).json({ error: 'Failed to get all places' });
    }
  }

  // Update place
  async updatePlace(req: Request, res: Response): Promise<void> {
    try {
      const place = await placeService.updatePlace(req.params.id, req.body);
      if (!place) {
        res.status(404).json({ error: 'Place not found' });
        return;
      }
      res.status(200).json(place);
    } catch (error) {
      logger.error('Failed to update place', { error });
      res.status(500).json({ error: 'Failed to update place' });
    }
  }

  // Delete place
  async deletePlace(req: Request, res: Response): Promise<void> {
    try {
      const place = await placeService.deletePlace(req.params.id);
      if (!place) {
        res.status(404).json({ error: 'Place not found' });
        return;
      }
      res.status(200).json({ message: 'Place deleted successfully' });
    } catch (error) {
      logger.error('Failed to delete place', { error });
      res.status(500).json({ error: 'Failed to delete place' });
    }
  }
}
