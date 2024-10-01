import { Router } from 'express';
import RouteController from '../../application/controllers/route.controller';

const routeRouter = Router();
const routeController = new RouteController();

routeRouter.post('/', routeController.createRoute);
routeRouter.get('/:id', routeController.getRouteById);
routeRouter.put('/:id', routeController.updateRoute);
routeRouter.delete('/:id', routeController.deleteRoute);

export default routeRouter;
