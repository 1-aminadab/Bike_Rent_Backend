import { Request, Response } from 'express';
import { bikeService } from '../service/bike.service';
import { logger } from '../../logger';

class BikeController {
  async addBike(req: Request, res: Response): Promise<void> {
    try {
      const newBike = await bikeService.addBike(req.body);
      res.status(201).json(newBike);
    } catch (error) {
      logger.error('Error in addBike controller', { error });
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getBikeById(req: Request, res: Response): Promise<void> {
    try {
      const bike = await bikeService.getBikeById(req.params.id);
      if (!bike) {
        res.status(404).json({ message: 'Bike not found' });
      } else {
        res.status(200).json(bike);
      }
    } catch (error) {
      logger.error('Error in getBikeById controller', { error });
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async updateBike(req: Request, res: Response): Promise<void> {
    try {
      const updatedBike = await bikeService.updateBike(req.params.id, req.body);
      if (!updatedBike) {
        res.status(404).json({ message: 'Bike not found' });
      } else {
        res.status(200).json(updatedBike);
      }
    } catch (error) {
      logger.error('Error in updateBike controller', { error });
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async deleteBike(req: Request, res: Response): Promise<void> {
    try {
      const deletedBike = await bikeService.deleteBike(req.params.id);
      if (!deletedBike) {
        res.status(404).json({ message: 'Bike not found' });
      } else {
        res.status(200).json({ message: 'Bike deleted successfully' });
      }
    } catch (error) {
      logger.error('Error in deleteBike controller', { error });
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getAllBikes(req: Request, res: Response): Promise<void> {
    try {
      const bikes = await bikeService.getAllBikes();
      res.status(200).json(bikes);
    } catch (error) {
      logger.error('Error in getAllBikes controller', { error });
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

export const bikeController = new BikeController();
