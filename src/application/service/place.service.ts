import PlaceModel, {IPlace} from '../../infrastructure/models/place.model';
import { logger } from '../../logger';
import { Document, Types } from 'mongoose';

export class PlaceService {
  
  // Create a new place
  async createPlace(placeData: IPlace): Promise<IPlace> {
    try {
      const newPlace = new PlaceModel(placeData);
      await newPlace.save();
      logger.info('New place created successfully', { place: newPlace });
      return newPlace;
    } catch (error) {
      logger.error('Error creating place', { error });
      throw new Error('Error creating place');
    }
  }

  // Get a place by ID
  async getPlaceById(id: string): Promise<IPlace | null> {
    try {
      const place = await PlaceModel.findById(id);
      if (!place) {
        logger.warn('Place not found', { id });
        return null
      }
      logger.info('Place retrieved successfully', { place });
      return place;
    } catch (error) {
      logger.error('Error retrieving place', { error });
      throw new Error('Error retrieving place');
    }
  }

  // Get all places
  async getAllPlaces(): Promise<IPlace[]> {
    try {
      const places = await PlaceModel.find({});
      logger.info('All places retrieved successfully', { count: places.length });
      return places;
    } catch (error) {
      logger.error('Error retrieving all places', { error });
      throw new Error('Error retrieving all places');
    }
  }

  // Update a place by ID
  async updatePlace(id: string, placeData: Partial<IPlace>): Promise<IPlace | null> {
    try {
      const updatedPlace = await PlaceModel.findByIdAndUpdate(id, placeData, { new: true });
      if (!updatedPlace) {
        logger.warn('Place not found for update', { id });
        throw new Error('Place not found');
      }
      logger.info('Place updated successfully', { updatedPlace });
      return updatedPlace;
    } catch (error) {
      logger.error('Error updating place', { error });
      throw new Error('Error updating place');
    }
  }

  // Delete a place by ID
  async deletePlace(id: string): Promise<IPlace | null> {
    try {
      const deletedPlace = await PlaceModel.findByIdAndDelete(id);
      if (!deletedPlace) {
        logger.warn('Place not found for deletion', { id });
        throw new Error('Place not found');
      }
      logger.info('Place deleted successfully', { deletedPlace });
      return deletedPlace;
    } catch (error) {
      logger.error('Error deleting place', { error });
      throw new Error('Error deleting place');
    }
  }
}
