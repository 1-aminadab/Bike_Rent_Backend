import { Request, Response } from 'express';
import { PriceService } from '../service/price.service';


import { logger } from '../../logger';

const priceService = new PriceService();

export class PriceController {
  // Create a new price
  static async createPrice(req: Request, res: Response) {
    try {
      const priceData = req.body;
      const newPrice = await priceService.createPrice(priceData);
      res.status(201).json(newPrice);
    } catch (error) {
      logger.error('Error in createPrice controller', { error });
      res.status(500).json({ error: error.message });
    }
  }

  // Get a price by ID
  static async getPriceById(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const price = await priceService.getPriceById(id);
      if (!price) {
        res.status(404).json({ error: 'Price not found' });
      } else {
        res.status(200).json(price);
      }
    } catch (error) {
      logger.error('Error in getPriceById controller', { error });
      res.status(500).json({ error: error.message });
    }
  }

  // Get all prices
  static async getAllPrices(req: Request, res: Response) {
    try {
      const prices = await priceService.getAllPrices();
      res.status(200).json(prices);
    } catch (error) {
      logger.error('Error in getAllPrices controller', { error });
      res.status(500).json({ error: error.message });
    }
  }

  // Update a price by ID
  static async updatePrice(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const priceData = req.body;
      const updatedPrice = await priceService.updatePrice(id, priceData);
      if (!updatedPrice) {
        res.status(404).json({ error: 'Price not found' });
      } else {
        res.status(200).json(updatedPrice);
      }
    } catch (error) {
      logger.error('Error in updatePrice controller', { error });
      res.status(500).json({ error: error.message });
    }
  }

  // Delete a price by ID
  static async deletePrice(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const deletedPrice = await priceService.deletePrice(id);
      if (!deletedPrice) {
        res.status(404).json({ error: 'Price not found' });
      } else {
        res.status(200).json({ message: 'Price deleted successfully' });
      }
    } catch (error) {
      logger.error('Error in deletePrice controller', { error });
      res.status(500).json({ error: error.message });
    }
  }
}
