import { BikeModel } from '../../infrastructure/models/bike.model';
import { logger } from '../../logger';

class BikeService {
  async addBike(bikeData: any) {
    try {
        // check if the bike already exists
      const existingBike = await BikeModel.findOne({ bikeId: bikeData.bikeId }).exec();
      if (existingBike) {
        throw new Error('Bike already exists');
      }
      
      const newBike = new BikeModel(bikeData);
      return await newBike.save();
    } catch (error) {
      logger.error('Error adding new bike', { error });
      throw new Error('Error adding new bike');
    }
  }

  async getBikeById(bikeId: string) {
    try {
      return await BikeModel.findById(bikeId).exec();
    } catch (error) {
      logger.error('Error fetching bike by ID', { error });
      throw new Error('Error fetching bike by ID');
    }
  }

  async updateBike(bikeId: string, bikeData: any) {
    console.log(bikeId, bikeData);
    // check if bike exists
    const existingBike = await BikeModel.findById(bikeId).exec();
    if (!existingBike) {
      throw new Error('Bike not found');
    }
    // console.log(bikeId, bikeData);
    try {
      return await BikeModel.findByIdAndUpdate(bikeId, bikeData, { new: true }).exec();
    } catch (error) {
      logger.error('Error updating bike', { error });
      throw new Error('Error updating bike');
    }
  }

  async deleteBike(bikeId: string) {
    try {
          // check if bike exists
    const existingBike = await BikeModel.findById(bikeId).exec();
    if (!existingBike) {
        // return status code and message
        throw new Error('Bike not found');
    }
      return await BikeModel.findByIdAndDelete(bikeId).exec();
    } catch (error) {
      logger.error('Error deleting bike', { error });
      throw new Error('Error deleting bike');
    }
  }

  async getAllBikes() {
    try {
      return await BikeModel.find().exec();
    } catch (error) {
      logger.error('Error fetching all bikes', { error });
      throw new Error('Error fetching all bikes');
    }
  }
}

export const bikeService = new BikeService();
