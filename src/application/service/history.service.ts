import mongoose from 'mongoose';
import { IHistory } from '../../infrastructure/models/history.model';
import { historyModel } from '../../infrastructure/models/history.model';

import { logger } from '../../logger';
import userModel from '../../infrastructure/models/user.model';
import { BikeModel } from '../../infrastructure/models/bike.model';
import rentalModel from '../../infrastructure/models/rental.model';
import paymentModel from '../../infrastructure/models/payment.model';
import routeModle from '../../infrastructure/models/route.modle';
import locationModel from '../../infrastructure/models/location.model';
import { TransactionModel } from '../../infrastructure/models/TransactionModel';
import trackingModel from '../../infrastructure/models/tracking.model';


class HistoryService {
  // Get all history data with user, bike, rental, and payment details
  async getAllHistory(): Promise<any[] | null> {
    try {
      // Fetch all history records
      const histories = await historyModel.find();

      console.log(histories, 'history ......');
      // Prepare data with relationships populated from other models
      const historyData = await Promise.all(histories.map(async (history) => {
        // Fetch related data for each history record
        const user = await userModel.findById(history.user_id);
        const bike = await BikeModel.findOne({ bikeId: history.bike_id });
        const rental = await rentalModel.findById(history.rental_id);
        const payment = await TransactionModel.findById(history.payment_id);
        const tracking = await trackingModel.findById(history.tracking_id);  // Tracking to get bike location

        console.log(user, bike, rental, payment, tracking, 'history ......');

        // Map the data to the required format
        return {
          bikeId: bike?.bikeId || 'Unknown',
          userName: `${user?.firstName || 'Unknown'} ${user?.lastName || ''}`.trim(),
          timeUsed: rental?.created_at && rental?.updated_at ? `${this.calculateTimeUsed(rental.created_at, rental.updated_at)}` : 'N/A',
          startTime: rental?.updated_at ? rental.updated_at : 'N/A',
          nationalIdNumber: user?.nationalIdNumber || 'Unknown',
          previousRides: await this.getPreviousRidesCount(user?._id), // Fetch previous rides count
          verificationStatus: user?.verified || false,
          userContact: user?.phoneNumber || 'Unknown',
          // bikeLocation: tracking ? await this.getLocationName(tracking.location) : 'Unknown',  // Bike location fetched from tracking model
          // userLocation: rental?.start_place_id ? await this.getLocationName(rental.start_place_id) : user?.address || 'Unknown',  // User location from rental start place
          assignedBy: rental?.start_place_admin ? await this.getAdminName(rental.start_place_admin) : 'Unknown',
          rideStatus: rental?.status || 'Unknown',
          direction: this.getDirection(rental?.start_place_id, rental?.end_place_id), // Define how to get direction
          station: rental?.route_id ? await this.getRouteStation(rental.route_id) : 'Unknown',
          serviceFee: payment?.amount || 'Unknown',
          paymentMethod: payment?.payment_method || 'Unknown',
        };
      }));

      return historyData;

    } catch (error) {
      logger.error('Error fetching history data', { error });
      throw new Error('Could not fetch history data');
    }
  }

  // Helper function to calculate time used (between rental start_time and the latest update)
  calculateTimeUsed(startTime: Date, updatedAt: Date): string {
    console.log(startTime, updatedAt,'../');
    
    const duration = Math.abs(updatedAt.getTime() - startTime.getTime()) / (1000 * 60 * 60); // in hours
    return `${duration.toFixed(2)} hours`;
  }

  // Helper function to fetch previous rides count
  async getPreviousRidesCount(userId: any | undefined): Promise<number> {
    if (!userId) return 0;
    const rideCount = await historyModel.countDocuments({ user_id: userId });
    return rideCount;
  }
  

  // Helper function to get location name by ID
  async getLocationName(locationId: mongoose.Types.ObjectId): Promise<any> {
    const location = await locationModel.findById(locationId);
    return location || 'Unknown Location';
  }

  // Helper function to get admin name by ID
  async getAdminName(adminId: mongoose.Types.ObjectId): Promise<string> {
    const admin = await userModel.findById(adminId).exec();
    return `${admin?.firstName || 'Unknown'} ${admin?.lastName || ''}`.trim();
  }

  // Helper function to get route station by route ID
  async getRouteStation(routeId: mongoose.Types.ObjectId): Promise<string> {
    const route = await routeModle.findById(routeId);
    return route?.route_name || 'Unknown Station';
  }

  // Helper function to get the direction (from place A to B or B to A)
  getDirection(startPlaceId: mongoose.Types.ObjectId | undefined, endPlaceId: mongoose.Types.ObjectId | undefined): string {
    if (!startPlaceId || !endPlaceId) return 'Unknown';
    // Assume A to B if start and end places are different
    return startPlaceId.toString() < endPlaceId.toString() ? 'A to B' : 'B to A';
  }

  // Helper function to get bike's current location by tracking ID
  async getBikeLocation(trackingId: mongoose.Types.ObjectId): Promise<any> {
    const tracking = await locationModel.findById(trackingId);
    return tracking || 'Unknown Location';
  }

  async createHistory(data: Partial<IHistory>): Promise<IHistory> {
    try {
      const history = new historyModel(data);
      return await history.save();
    } catch (error) {
      logger.error('Error creating history data', { error });
      throw new Error('Could not create history data');
    }
  }
  
  // Get history by ID
  async getHistoryById(id: mongoose.Types.ObjectId): Promise<IHistory[] | null> {
    try {
      return await historyModel.findById(id);
    } catch (error) {
      logger.error(`Error fetching history data for ID: ${id}`, { error });
      throw new Error('Could not fetch history data');
    }
  }

  // Get history by User ID
  async getHistoryByUserId(userId: mongoose.Types.ObjectId): Promise<IHistory[] | null> {
    try {
      return await historyModel.find({user_id: userId});
    } catch (error) {
      logger.error(`Error fetching history data for ID: ${userId}`, { error });
      throw new Error('Could not fetch history data');
    }
  }

  // Update history entry
  async updateHistory(id: mongoose.Types.ObjectId, updateData: Partial<IHistory>): Promise<IHistory | null> {
    try {
      return await historyModel.findByIdAndUpdate(id, updateData, { new: true });
    } catch (error) {
      logger.error(`Error updating history data for ID: ${id}`, { error });
      throw new Error('Could not update history data');
    }
  }

  // Delete history entry
  async deleteHistory(id: mongoose.Types.ObjectId): Promise<void> {
    try {
      await historyModel.findByIdAndDelete(id);
    } catch (error) {
      logger.error(`Error deleting history data for ID: ${id}`, { error });
      throw new Error('Could not delete history data');
    }
  }
}

export const historyService = new HistoryService();
