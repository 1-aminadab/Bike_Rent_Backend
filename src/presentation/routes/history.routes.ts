import express from 'express';
import { historyController } from '../../application/controllers/history.controller';

const router = express.Router();

// Create a new history entry
router.post('/', historyController.createHistory);

// Get history by ID
router.get('/:id', historyController.getHistoryById);

// Update a history entry
router.put('/:id', historyController.updateHistory);

// Delete a history entry
router.delete('/:id', historyController.deleteHistory);

export default router;
