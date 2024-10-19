import { TransactionModel } from "../../infrastructure/models/TransactionModel";
import moment from "moment";

// import { TransactionModel } from '../models/TransactionModel';
// services/TransactionService.ts

class TransactionService {
  // Fetch all transactions
  async getAllTransactions() {
    return await TransactionModel.find().sort({ updatedAt: -1, createdAt: -1 });
    try {
      const transactions = await TransactionModel.find();
      return transactions
    } catch (error) {
      return { status: "error", message: "Failed to fetch transactions", error };
    }
  }

  // Fetch transactions for a specific user
  async getTransactionsByUser(userId: string) {
    try {
      const transactions = await TransactionModel.find({ user_id: userId });
      return transactions
    } catch (error) {
      return { status: "error", message: "Failed to fetch transactions for the user", error };
    }
  }

  // Save a new transaction
  async createTransaction(transactionData: any) {
    try {
      const transaction = new TransactionModel(transactionData);
      const savedTransaction = await transaction.save();
      return savedTransaction;
    } catch (error) {
      return { status: "error", message: "Failed to create transaction", error };
    }
  }

  // Verify transaction by tx_ref
  async verifyTransaction(tx_ref: string) {
    try {
      const transaction = await TransactionModel.findOne({ tx_ref });
      if (!transaction) {
        return { status: "error", message: "Transaction not found" };
      }
      return transaction;
    } catch (error) {
      return { status: "error", message: "Failed to verify transaction", error };
    }
  }

  // Update a transaction
  async getTransactionByStatus(status: string,) {
    try {
      const transactions = await TransactionModel.find({status});
      return transactions
    } catch (error) {
      return { status: "error", message: "Failed to update transaction", error };
    }
  }
  // Update a transaction
  async updateTransaction(transactionId: string, updateData: any) {
    try {
      const updatedTransaction = await TransactionModel.findByIdAndUpdate(
        transactionId,
        updateData,
        { new: true }
      );
      if (!updatedTransaction) {
        return { status: "error", message: "Transaction not found" };
      }
      return updatedTransaction
    } catch (error) {
      return { status: "error", message: "Failed to update transaction", error };
    }
  }

  // Delete a transaction
  async deleteTransaction(transactionId: string) {
    try {
      const deletedTransaction = await TransactionModel.findByIdAndDelete(transactionId);
      if (!deletedTransaction) {
        return { status: "error", message: "Transaction not found" };
      }
      return { status: "success", message: "Transaction deleted successfully" };
    } catch (error) {
      return { status: "error", message: "Failed to delete transaction", error };
    }
  }

  // Get total revenue
  async getTotalRevenue() {
    return await TransactionModel.aggregate([
      { $group: { _id: null, totalRevenue: { $sum: "$amount" } } }
    ]);
  }

  // Filter transactions by payment method
  async filterTransactionsByMethod(method: string) {
    return await TransactionModel.find({ payment_method: method });
  }

  // Fetch transactions for a specific time frame
// Example of error handling in getTransactionsForToday()
async getTransactionsByTimeFrame(timeFrame: string) {
  try {
    let startDate: any, endDate: any, groupBy: any, dateFormat: any, duration: any, unit: any;
    const now = moment();

    // Define time frame logic
    switch (timeFrame) {
      case "today":
        startDate = now.clone().startOf("day");
        endDate = now.clone().endOf("day");
        groupBy = { hour: { $hour: "$createdAt" } };
        dateFormat = "HH"; // Format by hour
        duration = 24;
        unit = "hours"; // Increment unit
        break;
      case "this week":
        startDate = now.clone().startOf("isoWeek");
        endDate = now.clone().endOf("isoWeek");
        groupBy = { day: { $dayOfWeek: "$createdAt" } };
        dateFormat = "dddd"; // Format by day of the week
        duration = 7;
        unit = "days";
        break;
      case "this month":
        startDate = now.clone().startOf("month");
        endDate = now.clone().endOf("month");
        groupBy = { week: { $week: "$createdAt" } };
        dateFormat = "Week"; // Format by week number
        duration = 4; // We assume there are 4 weeks in the month
        unit = "weeks";
        break;
      case "this year":
        startDate = now.clone().startOf("year");
        endDate = now.clone().endOf("year");
        groupBy = { month: { $month: "$createdAt" } };
        dateFormat = "MMM"; // Format by month
        duration = 12; // 12 months
        unit = "months";
        break;
      default:
        throw new Error("Invalid time frame");
    }

    // Aggregation pipeline to sum data per group (hour/day/week/month)
    const transactions = await TransactionModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate.toDate(), $lte: endDate.toDate() },
        },
      },
      {
        $group: {
          _id: groupBy, // Group by the specified time frame
          cash: {
            $sum: { $cond: [{ $eq: ["$payment_method", "cash"] }, "$amount", 0] },
          },
          electronic: {
            $sum: { $cond: [{ $eq: ["$payment_method", "electronic"] }, "$amount", 0] },
          },
          total: { $sum: "$amount" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    // Fill missing data points with zeros and map transactions to correct time slots
    let categories = [];
    let cashData = [];
    let electronicData = [];
    let totalData = [];

    for (let i = 0; i < duration; i++) {
      let key;

      if (timeFrame === "this month") {
        // For 'this month', use "Week 1", "Week 2", etc.
        key = `Week ${i + 1}`;
      } else {
        key = startDate.clone().add(i, unit).format(dateFormat); // Use the correct format and time unit
      }

      const transaction = transactions.find((t) => {
        if (timeFrame === "today") return t._id.hour === i; // Match hours for 'today'
        if (timeFrame === "this week") return t._id.day === i + 1; // Match days of the week
        if (timeFrame === "this month") return t._id.week === startDate.clone().add(i, 'weeks').week(); // Match weeks of the month
        if (timeFrame === "this year") return t._id.month === i + 1; // Match months of the year
      });

      categories.push(key);
      cashData.push(transaction ? transaction.cash : 0);
      electronicData.push(transaction ? transaction.electronic : 0);
      totalData.push(transaction ? transaction.total : 0);
    }

    return {
      categories,
      series: [
        { name: "Cash Money", data: cashData },
        { name: "Electronic Money", data: electronicData },
        { name: "Total Revenue", data: totalData },
      ],
    };
  } catch (error) {
    console.error("Error fetching transaction data:", error);
    throw new Error("Error fetching transaction data");
  }
}




}



export const transactionService = new TransactionService();
