import RentalModel , { IRental } from './../../infrastructure/models/rental.model';
import { logger } from '../../logger';
import { socketActions } from '../../infrastructure/socket/socket.actions';
import RouteModel, { IRoute } from '../../infrastructure/models/route.modle';

const socketAction =  new socketActions()
export class RentalService {

  public async getRentalCountByRouteAndDirection(): Promise<any> {
    try {
      // Aggregate completed rentals grouped by route and direction
      const rentalData = await RentalModel.aggregate([
        {
          $match: { status: 'completed' } // Only completed rentals
        },
        {
          $group: {
            _id: {
              route_id: "$route_id",
              direction: {
                $cond: [
                  { $eq: ["$start_place_id", "$route_id"] }, // Determine direction based on start_place_id
                  "fromAtoB",
                  "fromBtoA"
                ]
              }
            },
            totalRentals: { $sum: 1 }
          }
        }
      ]);

      return rentalData;
    } catch (error) {
      logger.error('Error retrieving rental counts by route and direction', { error });
      throw new Error('Failed to retrieve rental counts');
    }
  }  


  public async getRoutesByPlace(startPlaceId: string, endPlaceId: string): Promise<IRoute[]> {
    try {
      // Find routes where the start_place_id or end_place_id matches
      const routes = await RouteModel.find({
        $or: [{ start_place_id: startPlaceId }, { end_place_id: endPlaceId }],
      }).populate('start_place_id').populate('end_place_id');
      
      if (!routes) {
        throw new Error('No routes found');
      }
      return routes;
    } catch (error) {
      throw new Error(`Error fetching routes: ${error.message}`);
    }
  }
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
      const rentals= await RentalModel.find({ status: 'ongoing' });
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

  public async getAllHistory(): Promise<IRental[] | null> {
    try {
      const rentals= await RentalModel.find({ status: 'completed' });
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

  async getRentalsByStatus(status: string): Promise<IRental[]> {
    try {
      const rentals = await RentalModel.find({ status });
      return rentals;
    } catch (error) {
      throw new Error(`Error fetching rentals by status: ${error.message}`);
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
