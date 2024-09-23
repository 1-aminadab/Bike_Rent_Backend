// controllers/routeController.ts

import { Request, Response } from 'express';
import { routeService } from '../service/route.service'; // Adjust the path as needed

class RouteController {
  // Create a new route
  async createRoute(req: Request, res: Response) {
    try {
      const route = await routeService.createRoute(req.body);
      res.status(201).json(route);
    } catch (error) {
      res.status(400).json({ message: 'Error creating route', error });
    }
  }

  // Get all routes
  async getAllRoutes(req: Request, res: Response) {
    try {
      const routes = await routeService.getAllRoutes();
      res.status(200).json(routes);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching routes', error });
    }
  }

  // Get a route by ID
  async getRouteById(req: Request, res: Response) {
    try {
      const route = await routeService.getRouteById(req.params.id);
      if (!route) {
        return res.status(404).json({ message: 'Route not found' });
      }
      res.status(200).json(route);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching route', error });
    }
  }

  // Update a route by ID
  async updateRoute(req: Request, res: Response) {
    try {
      const updatedRoute = await routeService.updateRoute(req.params.id, req.body);
      if (!updatedRoute) {
        return res.status(404).json({ message: 'Route not found' });
      }
      res.status(200).json(updatedRoute);
    } catch (error) {
      res.status(400).json({ message: 'Error updating route', error });
    }
  }

  // Delete a route by ID
  async deleteRoute(req: Request, res: Response) {
    try {
      const deletedRoute = await routeService.deleteRoute(req.params.id);
      if (!deletedRoute) {
        return res.status(404).json({ message: 'Route not found' });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting route', error });
    }
  }
}

export const routeController = new RouteController();
