// rental.routes.ts

import { Router } from 'express';
import { RentalController } from '../../application/controllers/rental.controller';

const router = Router();
const rentalController = new RentalController();

router.post('/', (req, res) => rentalController.createRental(req, res));

router.get('/:id', (req, res) => rentalController.getRentalById(req, res));

router.put('/:id', (req, res) => rentalController.updateRental(req, res));

router.delete('/:id', (req, res) => rentalController.deleteRental(req, res));

export default router;
