import { Router } from 'express';
import { bikeController } from '../../application/controllers/bike.controller';


const bikeRouter = Router();

bikeRouter.post('/addbike', bikeController.addBike);
bikeRouter.get('/singlebike/:id', bikeController.getBikeById);
bikeRouter.patch('/update/:id', bikeController.updateBike);
bikeRouter.delete('/delete/:id', bikeController.deleteBike);
bikeRouter.get('/getallbikes', bikeController.getAllBikes);

export default bikeRouter;
