import mongoose from 'mongoose';
import { IHistory } from '../../infrastructure/models/history.model';
import { historyModel } from '../../infrastructure/models/history.model';
import { logger } from '../../logger';

class HistoryService {
  // Create a new history entry
  async createHistory(data: Partial<IHistory>): Promise<IHistory> {
    try {
      const history = new historyModel(data);
      return await history.save();
    } catch (error) {
      logger.error('Error creating history data', { error });
      throw new Error('Could not create history data');
    }
  }
  
  // Get history by ID
  async getHistoryById(id: mongoose.Types.ObjectId): Promise<IHistory[] | null> {
    try {
      return await historyModel.findById(id);
    } catch (error) {
      logger.error(`Error fetching history data for ID: ${id}`, { error });
      throw new Error('Could not fetch history data');
    }
  }

  async getAllHistory(): Promise<IHistory[] | null> {
    console.log('getAllHistory called');
    
    try {
      return await historyModel.find();
    } catch (error) {
      logger.error(`Error fetching history data`, { error });
      throw new Error('Could not fetch history data');
    }
  }
  
  async getHistoryByUserId(userId: mongoose.Types.ObjectId): Promise<IHistory[] | null> {
    try {
      return await historyModel.find({user_id:userId});
    } catch (error) {
      logger.error(`Error fetching history data for ID: ${userId}`, { error });
      throw new Error('Could not fetch history data');
    }
  }

  // Update history entry
  async updateHistory(id: mongoose.Types.ObjectId, updateData: Partial<IHistory>): Promise<IHistory | null> {
    try {
      return await historyModel.findByIdAndUpdate(id, updateData, { new: true });
    } catch (error) {
      logger.error(`Error updating history data for ID: ${id}`, { error });
      throw new Error('Could not update history data');
    }
  }

  // Delete history entry
  async deleteHistory(id: mongoose.Types.ObjectId): Promise<void> {
    try {
      await historyModel.findByIdAndDelete(id);
    } catch (error) {
      logger.error(`Error deleting history data for ID: ${id}`, { error });
      throw new Error('Could not delete history data');
    }
  }
}

export const historyService = new HistoryService();
