// services/PaymentService.ts
import axios from 'axios';
import { TransactionModel } from '../../infrastructure/models/TransactionModel';
import UserModel from "../../infrastructure/models/user.model";


class PaymentService {
  private chapaUrl = 'https://api.chapa.co/v1/transaction/initialize';
  private barrierToken = 'CHASECK_TEST-G60ugRSIFvxKSsRPMHHcUfUGmCAhLfo4';

  // Fetch user by ID from the User model
  async getUserById(userId: string) {
    return await UserModel.findById(userId);
  }

  // Generate a unique transaction reference
  generateTxRef() {
    return `chetataest-${Math.floor(Math.random() * 10000)}`;
  }

  // Save the transaction to the database
  async saveTransaction(user: any, amount: number, tx_ref: string) {
    const transaction = new TransactionModel({
      user_id: user._id,
      tx_ref,
      amount,
      email: user.email,
      first_name: user.firstName,
      last_name: user.lastName,
      phone_number: user.phoneNumber,
    });
    await transaction.save();
    return transaction;
  }

  // Create the payment request to Chapa
  async initializePayment(userId: string, amount: number) {
    const user = await this.getUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const tx_ref = this.generateTxRef();
console.log(user, tx_ref,amount,'..............')
    // Save the transaction in the database
    await this.saveTransaction(user, amount, tx_ref);

    const payload = {
      amount: amount.toString(),
      currency: 'ETB',
      email: user?.email,
      first_name: user.firstName,
      last_name: user.lastName,
      phone_number: user.phoneNumber,
      tx_ref,
      callback_url: 'https://webhook.site/your-webhook-url',
      return_url: 'second_project://payment-success',
      customization: {
        title: 'addis bike',
        description: 'I love online payment',
      },
    };

    

    const headers = {
      Authorization: `Bearer ${this.barrierToken}`
    };

    console.log(payload,headers,'......pl')
    const response = await axios.post(`https://api.chapa.co/v1/transaction/initialize`, payload, { headers });
    console.log(response.data)
    return response.data;
  }

  // Verify the transaction by tx_ref
  async verifyPayment(tx_ref: string) {
    const verifyUrl = `https://api.chapa.co/v1/transaction/verify/${tx_ref}`;
    const headers = {
      Authorization: `Bearer ${this.barrierToken}`,
    };

    // Send the GET request to verify the transaction
    const response = await axios.get(verifyUrl, { headers });
    return response.data;
  }

  // Update the transaction status based on verification
  async updateTransactionStatus(tx_ref: string, status: string) {
    await TransactionModel.findOneAndUpdate({ tx_ref }, { status });
  }
}

export const paymentService = new PaymentService();
