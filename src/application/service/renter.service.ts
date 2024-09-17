import rentalModel,{IRental} from '../../infrastructure/models/rental.model';

import mongoose from 'mongoose';
import { logger } from '../../logger';

export default class RentalService {
  public async createRental(data: IRental): Promise<IRental> {
    try {
      const rental = new Rental(data);
      await rental.save();
      logger.info(`Rental created with ID: ${rental._id}`);
      return rental;
    } catch (error) {
      logger.error(`Error creating rental: ${error.message}`, { error });
      throw new Error('Could not create rental');
    }
  }

  public async getRentalById(id: string): Promise<IRental | null> {
    try {
      const rental = await Rental.findById(id).populate('user_id').populate('bike_id');
      if (!rental) {
        logger.warn(`Rental not found with ID: ${id}`);
        return null;
      }
      return rental;
    } catch (error) {
      logger.error(`Error finding rental by ID: ${error.message}`, { error });
      throw new Error('Could not retrieve rental');
    }
  }

  public async updateRental(id: string, data: Partial<IRental>): Promise<IRental | null> {
    try {
      const rental = await Rental.findByIdAndUpdate(id, data, { new: true });
      if (!rental) {
        logger.warn(`Rental not found for update with ID: ${id}`);
        throw new Error('Rental not found');
      }
      logger.info(`Rental updated with ID: ${rental._id}`);
      return rental;
    } catch (error) {
      logger.error(`Error updating rental: ${error.message}`, { error });
      throw new Error('Could not update rental');
    }
  }

  public async deleteRental(id: string): Promise<void> {
    try {
      const rental = await Rental.findByIdAndDelete(id);
      if (!rental) {
        logger.warn(`Rental not found for deletion with ID: ${id}`);
        throw new Error('Rental not found');
      }
      logger.info(`Rental deleted with ID: ${rental._id}`);
    } catch (error) {
      logger.error(`Error deleting rental: ${error.message}`, { error });
      throw new Error('Could not delete rental');
    }
  }

  public async getAllRentals(): Promise<IRental[]> {
    try {
      const rentals = await Rental.find().populate('user_id').populate('bike_id');
      return rentals;
    } catch (error) {
      logger.error(`Error retrieving rentals: ${error.message}`, { error });
      throw new Error('Could not retrieve rentals');
    }
  }
}
