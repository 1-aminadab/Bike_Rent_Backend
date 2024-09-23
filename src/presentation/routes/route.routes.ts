// routes/routeRoutes.ts

import { Router } from 'express';
import { routeController } from '../../application/controllers/route.controller'; // Adjust the path as needed

const router = Router();

// Define routes for the Route resource
router.post('/', routeController.createRoute);          // Create a new route
router.get('/', routeController.getAllRoutes);         // Get all routes
router.get('/:id', routeController.getRouteById);      // Get a route by ID
router.put('/:id', routeController.updateRoute);       // Update a route by ID
router.delete('/:id', routeController.deleteRoute);    // Delete a route by ID

export default router;
