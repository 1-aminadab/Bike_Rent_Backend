
import RouteModel, { IRoute } from '../../infrastructure/models/route.modle';
import { logger } from '../../logger';
import mongoose from 'mongoose';

export default class RouteService {
  // Create a new Route
  public async createRoute(routeData: IRoute): Promise<IRoute> {
    try {
      const newRoute = new RouteModel(routeData);
      const savedRoute = await newRoute.save();
      logger.info('Route created successfully', { routeId: savedRoute._id });
      return savedRoute;
    } catch (error) {
      logger.error('Error creating route', { error });
      throw new Error('Error creating route');
    }
  }

  // Get Route by ID
  public async getRouteById(routeId: string): Promise<IRoute | null> {
    try {
      if (!mongoose.Types.ObjectId.isValid(routeId)) {
        logger.warn('Invalid route ID format', { routeId });
        throw new Error('Invalid route ID format');
      }
      
      const route = await RouteModel.findById(routeId).exec();
      if (!route) {
        logger.warn('Route not found', { routeId });
        throw new Error('Route not found');
      }
      
      logger.info('Route retrieved successfully', { routeId });
      return route;
    } catch (error) {
      logger.error('Error retrieving route', { error });
      throw error;
    }
  }

  // Update Route
  public async updateRoute(routeId: string, updateData: Partial<IRoute>): Promise<IRoute | null> {
    try {
      const updatedRoute = await RouteModel.findByIdAndUpdate(routeId, updateData, { new: true }).exec();
      if (!updatedRoute) {
        logger.warn('Route not found for update', { routeId });
        throw new Error('Route not found for update');
      }
      
      logger.info('Route updated successfully', { routeId });
      return updatedRoute;
    } catch (error) {
      logger.error('Error updating route', { error });
      throw error;
    }
  }

  // Delete Route
  public async deleteRoute(routeId: string): Promise<void> {
    try {
      const deletedRoute = await RouteModel.findByIdAndDelete(routeId).exec();
      if (!deletedRoute) {
        logger.warn('Route not found for deletion', { routeId });
        throw new Error('Route not found for deletion');
      }
      
      logger.info('Route deleted successfully', { routeId });
    } catch (error) {
      logger.error('Error deleting route', { error });
      throw error;
    }
  }
}
