// services/TransactionService.ts

import { TransactionModel } from "../../infrastructure/models/TransactionModel";

// import { TransactionModel } from '../models/TransactionModel';
TransactionModel

class TransactionService {
  // Fetch all transactions
  async getAllTransactions() {
    return await TransactionModel.find();
  }

  // Fetch transactions for a specific user
  async getTransactionsByUser(userId: string) {
    return await TransactionModel.find({ user_id: userId });
  }

  // Save a new transaction
  async createTransaction(transactionData: any) {
    const transaction = new TransactionModel(transactionData);
    return await transaction.save();
  }

  // Verify transaction by tx_ref
  async verifyTransaction(tx_ref: string) {
    return await TransactionModel.findOne({ tx_ref });
  }
}

export const transactionService = new TransactionService();
