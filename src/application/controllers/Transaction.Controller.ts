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
      const { tx_ref } = req.query;
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
}

export const transactionController = new TransactionController();
