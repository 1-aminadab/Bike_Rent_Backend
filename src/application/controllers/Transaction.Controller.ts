// controllers/TransactionController.ts
import { Request, Response } from 'express';
import { transactionService } from '../service/Transaction.service';

class TransactionController {
  // Get all transactions
  async getAllTransactions(req: Request, res: Response) {
    try {
      const transactions = await transactionService.getAllTransactions();
      res.status(200).json(transactions);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching transactions', error });
    }
  }
  

  // Get transaction history for a specific user
  async getTransactionHistory(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const transactions = await transactionService.getTransactionsByUser(userId);
      res.status(200).json(transactions);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching transaction history', error });
    }
  }

  // Verify transaction by tx_ref
  async verifyTransaction(req: Request, res: Response) {
    try {
      const { tx_ref } = req.params;
      const transaction = await transactionService.verifyTransaction(tx_ref as string);
      if (transaction) {
        res.status(200).json(transaction);
      } else {
        res.status(404).json({ message: 'Transaction not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error verifying transaction', error });
    }
  }

  
  // Get total revenue
  async getTotalRevenue(req: Request, res: Response) {
  try {
    const revenue = await transactionService.getTotalRevenue();
    res.status(200).json(revenue);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching revenue', error });
  }
}

  // Filter transactions by payment method
  async filterTransactionsByMethod(req: Request, res: Response) {
    try {
      const { method } = req.query;
      const transactions = await transactionService.filterTransactionsByMethod(method as string);
      res.status(200).json(transactions);
    } catch (error) {
      res.status(500).json({ message: 'Error filtering transactions', error });
    }
  }

  async getTransactionsByTimeFrame(req: Request, res: Response) {
    const { timeFrame } = req.params;

    try {
    const transactions = await transactionService.getTransactionsByTimeFrame(timeFrame);
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
  }



}

export const transactionController = new TransactionController();
