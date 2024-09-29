import express from 'express';
import { trackingController } from '../../application/controllers/tracking.controller';

const router = express.Router();

router.post('/', trackingController.createTracking);

router.get('/:id', trackingController.getTrackingById);

router.get('/', trackingController.getAllTracking);

// Update tracking
router.put('/:id', trackingController.updateTracking);

// Add tracking data (location, speed, distance, etc.)
router.post('/:id/data', trackingController.addTrackingData);

// Update status (start, pause, resume, stop)
router.patch('/:id/status', trackingController.updateStatus);

// Delete tracking
router.delete('/tracking/:id', trackingController.deleteTracking);

export default router;
