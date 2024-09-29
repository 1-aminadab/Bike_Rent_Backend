// rental.controller.ts

import { Request, Response } from 'express';
import { RentalService } from '../service/rental.service';
import { logger } from '../../logger';

const rentalService = new RentalService();

export class RentalController {
  public async createRental(req: Request, res: Response) {
    try {
      const rental = await rentalService.createRental(req.body);
      return res.status(201).json(rental);
    } catch (error) {
      logger.error('Error in createRental controller', { error });
      return res.status(500).json({ message: 'Failed to create rental' });
    }
  }
  
  public async getAllRentalById(req: Request, res: Response): Promise<Response> {
    try {
      const rental = await rentalService.getAllRental()
      if (!rental) {
        return res.status(404).json({ message: 'Rental not found' });
      }
      return res.status(200).json(rental);
    } catch (error) {
      logger.error('Error in getRentalById controller', { error });
      return res.status(500).json({ message: 'Failed to retrieve rental' });
    }
  }

  public async getRentalById(req: Request, res: Response): Promise<Response> {
    try {
      const rental = await rentalService.getRentalById(req.params.id);
      if (!rental) {
        return res.status(404).json({ message: 'Rental not found' });
      }
      return res.status(200).json(rental);
    } catch (error) {
      logger.error('Error in getRentalById controller', { error });
      return res.status(500).json({ message: 'Failed to retrieve rental' });
    }
  }
  async getRentalsByStatus(req: Request, res: Response): Promise<void> {
    const { status } = req.params;

    try {
      if (!['waiting', 'ongoing', 'completed', 'canceled'].includes(status)) {
        res.status(400).json({ message: 'Invalid status provided' });
        return;
      }

      const rentals = await rentalService.getRentalsByStatus(status)
      res.status(200).json(rentals);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  public async updateRental(req: Request, res: Response): Promise<Response> {
    try {
      const rental = await rentalService.updateRental(req.params.id, req.body);
      if (!rental) {
        return res.status(404).json({ message: 'Rental not found' });
      }
      return res.status(200).json(rental);
    } catch (error) {
      logger.error('Error in updateRental controller', { error });
      return res.status(500).json({ message: 'Failed to update rental' });
    }
  }

  public async deleteRental(req: Request, res: Response): Promise<Response> {
    try {
      await rentalService.deleteRental(req.params.id);
      return res.status(204).json();
    } catch (error) {
      logger.error('Error in deleteRental controller', { error });
      return res.status(500).json({ message: 'Failed to delete rental' });
    }
  }
}
