// services/routeService.ts

import Route from '../../infrastructure/models/route.modle'; // Adjust the path as needed
// import { IRoute } from '../models/Route'; // Adjust the path as needed
// import { IUser } from '../../domain/interface/user.interface';



class RouteService {
  // Create a new route
  async createRoute(routeData: any) {
    console.log(routeData,'......')
    const route = new Route(routeData);
    return await route.save();
  }

  // Get all routes
  async getAllRoutes() {
    return await Route.find().populate('start_place_id end_place_id');
  }

  // Get a route by ID
  async getRouteById(routeId: string) {
    return await Route.findById(routeId).populate('start_place_id end_place_id');
  }

  // Update a route by ID
  async updateRoute(routeId: string, updateData: Partial<any>) {
    return await Route.findByIdAndUpdate(routeId, updateData, { new: true });
  }

  // Delete a route by ID
  async deleteRoute(routeId: string) {
    return await Route.findByIdAndDelete(routeId);
  }
}

export const routeService = new RouteService();
