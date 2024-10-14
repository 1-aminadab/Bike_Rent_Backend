// rental.routes.ts

import { Router } from 'express';
import { RentalController } from '../../application/controllers/rental.controller';

const router = Router();
const rentalController = new RentalController();

router.post('/', (req, res) => rentalController.createRental(req, res));

router.get('/direction-count', (req, res) => rentalController.getRentalCountByRouteAndDirection(req, res));
router.get('/', (req, res) => rentalController.getAllRental(req, res));
router.get('/history/', (req, res) => rentalController.getAllHistory(req, res));

router.get('/:id', (req, res) => rentalController.getRentalById(req, res));

router.put('/:id', (req, res) => rentalController.updateRental(req, res));

router.delete('/:id', (req, res) => rentalController.deleteRental(req, res));

router.get('/status/:status', (req, res) => rentalController.getRentalsByStatus(req, res));
export default router;
