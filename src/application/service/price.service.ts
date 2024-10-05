import PriceModel, { IPrice } from '../../infrastructure/models/price.modle';
import { logger } from '../../logger';
import { Types } from 'mongoose';

export class PriceService {
  // Create a new price
  async createPrice(priceData: Partial<IPrice>): Promise<IPrice> {
    try {
      const newPrice = new PriceModel(priceData);
      await newPrice.save();
      logger.info('New price created successfully', { price: newPrice });
      return newPrice;
    } catch (error) {
      logger.error('Error creating price', { error });
      throw new Error(`Error creating price: ${error.message}`);
    }
  }

  // Get a price by ID
  async getPriceById(id: string): Promise<IPrice | null> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        logger.warn('Invalid price ID format', { id });
        throw new Error('Invalid price ID format');
      }

      const price = await PriceModel.findById(id);
      if (!price) {
        logger.warn('Price not found', { id });
        return null;
      }

      logger.info('Price retrieved successfully', { price });
      return price;
    } catch (error) {
      logger.error('Error retrieving price', { error });
      throw new Error(`Error retrieving price: ${error.message}`);
    }
  }

  // Get all prices
  async getAllPrices(): Promise<IPrice[]> {
    try {
      const prices = await PriceModel.find({});
      logger.info('All prices retrieved successfully', { count: prices.length });
      return prices;
    } catch (error) {
      logger.error('Error retrieving all prices', { error });
      throw new Error(`Error retrieving all prices: ${error.message}`);
    }
  }

  // Update a price by ID
  async updatePrice(id: string, priceData: Partial<IPrice>): Promise<IPrice | null> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        logger.warn('Invalid price ID format for update', { id });
        throw new Error('Invalid price ID format');
      }

      const updatedPrice = await PriceModel.findByIdAndUpdate(id, priceData, { new: true });
      if (!updatedPrice) {
        logger.warn('Price not found for update', { id });
        throw new Error('Price not found');
      }

      logger.info('Price updated successfully', { updatedPrice });
      return updatedPrice;
    } catch (error) {
      logger.error('Error updating price', { error });
      throw new Error(`Error updating price: ${error.message}`);
    }
  }

  // Delete a price by ID
  async deletePrice(id: string): Promise<IPrice | null> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        logger.warn('Invalid price ID format for deletion', { id });
        throw new Error('Invalid price ID format');
      }

      const deletedPrice = await PriceModel.findByIdAndDelete(id);
      if (!deletedPrice) {
        logger.warn('Price not found for deletion', { id });
        throw new Error('Price not found');
      }

      logger.info('Price deleted successfully', { deletedPrice });
      return deletedPrice;
    } catch (error) {
      logger.error('Error deleting price', { error });
      throw new Error(`Error deleting price: ${error.message}`);
    }
  }
}
