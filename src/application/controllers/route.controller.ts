import { Request, Response } from 'express';
import RouteService from '../service/route.service';
import { logger } from '../../logger';

const routeService = new RouteService();

export default class RouteController {
  // Create a new Route

  public async getRoutesByPlace(req: Request, res: Response) {
    try {
      const { startPlaceId, endPlaceId } = req.query; // Assumed to be passed via query params
      const routes = await routeService.getRoutesByPlace(startPlaceId as string, endPlaceId as string);
      return res.status(200).json(routes);
    } catch (error) {
      return res.status(500).json({ message: 'Failed to retrieve routes', error: error.message });
    }
  }
  public async createRoute(req: Request, res: Response): Promise<void> {
    try {
      const routeData = req.body;
      const newRoute = await routeService.createRoute(routeData);
      res.status(201).json(newRoute);
    } catch (error) {
      logger.error('Error in createRoute controller', { error });
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Get Route by ID
  public async getRouteById(req: Request, res: Response): Promise<void> {
    try {
      const routeId = req.params.id;
      const route = await routeService.getRouteById(routeId);
      res.status(200).json(route);
    } catch (error:any) {
      logger.error('Error in getRouteById controller', { error });
      res.status(404).json({ error: error?.message });
    }
  }

  public async getAllRoutes(req: Request, res: Response): Promise<void> {
    try {
   
      const route = await routeService.getAllRoutes();
      res.status(200).json(route);
    } catch (error) {
      logger.error('Error in getRouteById controller', { error });
      res.status(404).json({ error: error.message });
    }
  }
  // Update Route
  public async updateRoute(req: Request, res: Response): Promise<void> {
    try {
      const routeId = req.params.id;
      const updateData = req.body;
      const updatedRoute = await routeService.updateRoute(routeId, updateData);
      res.status(200).json(updatedRoute);
    } catch (error) {
      logger.error('Error in updateRoute controller', { error });
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Delete Route
  public async deleteRoute(req: Request, res: Response): Promise<void> {
    try {
      const routeId = req.params.id;
      await routeService.deleteRoute(routeId);
      res.status(200).json({ message: 'Route deleted successfully' });
    } catch (error) {
      logger.error('Error in deleteRoute controller', { error });
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}
