import express from 'express';
import { trackingController } from '../../application/controllers/tracking.controller';

const router = express.Router();

router.post('/tracking', trackingController.createTracking);

router.get('/tracking/:id', trackingController.getTrackingById);

router.get('/tracking', trackingController.getAllTracking);

// Update tracking
router.put('/tracking/:id', trackingController.updateTracking);

// Add tracking data (location, speed, distance, etc.)
router.post('/tracking/:id/data', trackingController.addTrackingData);

// Update status (start, pause, resume, stop)
router.patch('/tracking/:id/status', trackingController.updateStatus);

// Delete tracking
router.delete('/tracking/:id', trackingController.deleteTracking);

export default router;
