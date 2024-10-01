import { Router } from 'express';
import { PlaceController } from '../../application/controllers/place.controller';

const router = Router();
const placeController = new PlaceController();

router.post('/', (req, res) => placeController.createPlace(req, res));
router.get('/', (req, res) => placeController.getAllPlaces(req, res));
router.get('/:id', (req, res) => placeController.getPlaceById(req, res));
router.put('/:id', (req, res) => placeController.updatePlace(req, res));
router.delete('/:id', (req, res) => placeController.deletePlace(req, res));

export default router;
