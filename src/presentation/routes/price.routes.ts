import { Router } from 'express';
import { PriceController } from '../../application/controllers/price.controller';
// import { PriceController } from '../controllers/priceController';


const router = Router();

// CRUD routes for price management
router.post('/', PriceController.createPrice);
router.get('/', PriceController.getAllPrices);
router.get('/:id', PriceController.getPriceById);
router.put('/:id', PriceController.updatePrice);
router.delete('/:id', PriceController.deletePrice);

export default router;