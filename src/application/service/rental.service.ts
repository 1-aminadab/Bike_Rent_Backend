import RentalModel , { IRental } from './../../infrastructure/models/rental.model';
import { logger } from '../../logger';
import { socketActions } from '../../infrastructure/socket/socket.actions';

const socketAction =  new socketActions()
export class RentalService {
  public async createRental(rentalData: IRental): Promise<IRental> {
    try {
      const rental = new RentalModel(rentalData);
      await rental.save();
      socketAction.sendRental(rentalData)
      logger.info('Rental created successfully', { rental });

      
      return rental;
    } catch (error) {
      logger.error('Error creating rental', { error });
      throw new Error('Failed to create rental');
    }
  }

  public async getRentalById(rentalId: string): Promise<IRental | null> {
    try {
      const rental = await RentalModel.findById(rentalId);
      if (!rental) {
        throw new Error('Rental not found');
      }
      logger.info(`Rental retrieved successfully: ${rentalId}`);
      return rental;
    } catch (error) {
      logger.error('Error retrieving rental', { error });
      throw new Error('Failed to retrieve rental');
    }
  }
  public async getAllRental(): Promise<IRental[] | null> {
    try {
      const rentals= await RentalModel.find();
      if (!rentals) {
        throw new Error('Rental not found');
      }
      logger.info(`Rental retrieved successfully: `);
      return rentals;
    } catch (error) {
      logger.error('Error retrieving rental', { error });
      throw new Error('Failed to retrieve rental');
    }
  }
  public async updateRental(rentalId: string, rentalData: Partial<IRental>): Promise<IRental | null> {
    try {
      const rental = await RentalModel.findByIdAndUpdate(rentalId, rentalData, { new: true });
      if (!rental) {
        throw new Error('Rental not found');
      }
      logger.info(`Rental updated successfully: ${rentalId}`);
      return rental;
    } catch (error) {
      logger.error('Error updating rental', { error });
      throw new Error('Failed to update rental');
    }
  }

  public async deleteRental(rentalId: string): Promise<void> {
    try {
      const rental = await RentalModel.findByIdAndDelete(rentalId);
      if (!rental) {
        throw new Error('Rental not found');
      }
      logger.info(`Rental deleted successfully: ${rentalId}`);
    } catch (error) {
      logger.error('Error deleting rental', { error });
      throw new Error('Failed to delete rental');
    }
  }
}
