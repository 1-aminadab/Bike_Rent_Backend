import { historyService } from './../service/history.service';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { logger } from '../../logger';

class HistoryController {
  // Create a new history entry
  async createHistory(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;
      const history = await historyService.createHistory(data);
      res.status(201).json(history);
    } catch (error) {
      logger.error('Error creating history', { error });
      res.status(500).json({ message: 'Error creating history' });
    }
  }
  // Get history by ID
  async getHistoryById(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const history = await historyService.getHistoryById(new mongoose.Types.ObjectId(id));
      if (!history) return res.status(404).json({ message: 'History not found' });
      res.status(200).json(history);
    } catch (error) {
      logger.error('Error fetching history', { error });
      res.status(500).json({ message: 'Error fetching history' });
    }
  }

  async getAllHistory(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const history = await historyService.getAllHistory();
      if (!history) return res.status(404).json({ message: 'History not found' });
      res.status(200).json(history);
    } catch (error) {
      logger.error('Error fetching history', { error });
      res.status(500).json({ message: 'Error fetching history' });
    }
  }

  async getHistoryByUserId(req: Request, res: Response): Promise<any> {
    try {
      const { userId } = req.params;
      const history = await historyService.getHistoryByUserId(new mongoose.Types.ObjectId(userId));
      if (!history) return res.status(404).json({ message: 'History not found' });
      res.status(200).json(history);
    } catch (error) {
      logger.error('Error fetching history', { error });
      res.status(500).json({ message: 'Error fetching history' });
    }
  }
  
  // Update history entry
  async updateHistory(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const history = await historyService.updateHistory(new mongoose.Types.ObjectId(id), updateData);
      if (!history) return res.status(404).json({ message: 'History not found' });
      res.status(200).json(history);
    } catch (error) {
      logger.error('Error updating history', { error });
      res.status(500).json({ message: 'Error updating history' });
    }
  }

  // Delete history entry
  async deleteHistory(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await historyService.deleteHistory(new mongoose.Types.ObjectId(id));
      res.status(204).send();
    } catch (error) {
      logger.error('Error deleting history', { error });
      res.status(500).json({ message: 'Error deleting history' });
    }
  }
}

export const historyController = new HistoryController();
