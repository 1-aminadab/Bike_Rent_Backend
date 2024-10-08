import axios from 'axios';
import { TransactionModel } from '../../infrastructure/models/TransactionModel';
import UserModel from "../../infrastructure/models/user.model";
require('dotenv').config();

class PaymentService {
  private chapaUrl = process.env.CHAPA_API_INITIALIZE
  private barrierToken = process.env.CHAPA_TOKEN

  // Fetch user by ID from the User model
  async getUserById(userId: string) {
    return await UserModel.findById(userId);
  }

  // Generate a unique transaction reference
  generateTxRef() {
    return `chetataest-${Math.floor(Math.random() * 10000)}`;
  }

  // Save the transaction to the database with pending status
  async saveTransaction(user: any, amount: number, tx_ref: string, payment_method: string) {
    const transaction = new TransactionModel({
      user_id: user._id,
      tx_ref,
      amount,
      email: user.email,
      first_name: user.firstName,
      last_name: user.lastName,
      phone_number: user.phoneNumber,
      status: 'pending',  // Set the initial status to pending
      payment_method,      // Save the payment method
    });
    await transaction.save();
    return transaction;
  }

  // Create the payment request to Chapa
  async initializePayment(userId: string, amount: number, payment_method: string) {
    const user = await this.getUserById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const tx_ref = this.generateTxRef();

    // Save the transaction in the database with 'pending' status
    await this.saveTransaction(user, amount, tx_ref, payment_method);

    const payload = {
      amount: amount.toString(),
      currency: 'ETB',
      email: user?.email,
      first_name: user.firstName,
      last_name: user.lastName,
      phone_number: user.phoneNumber,
      tx_ref,
      callback_url: 'https://webhook.site/your-webhook-url',
      return_url: 'http://addisbike.com',
      customization: {
        title: 'addis bike',
        description: 'I love online payment',
      },
      status: 'pending',  // Add the status field to the payload
      payment_method: payment_method, // Include payment method in the payload
    };
   console.log(payload)
    const headers = {
      Authorization: `Bearer ${this.barrierToken}`,
    };

    console.log(payload, headers, '......pl');
    try {
      const response = await axios.post(this.chapaUrl, payload, { headers });
      
      // Update transaction status to success if the Chapa request is successful
      await this.updateTransactionStatus(tx_ref, 'success');

      console.log(response.data, 'payment init response');
      return response.data;
    } catch (error) {
      console.error('Payment initialization failed:', error);
      // Optionally, update transaction status to failed if an error occurs
      await this.updateTransactionStatus(tx_ref, 'failed');
      throw new Error('Payment initialization failed');
    }
  }

  // Verify the transaction by tx_ref
  async verifyPayment(tx_ref: string) {
    const verifyUrl = `${process.env.CHAPA_API_VERIFY}/${tx_ref}`;
    const headers = {
      Authorization: `Bearer ${this.barrierToken}`,
    };

    const response = await axios.get(verifyUrl, { headers });
    return response.data;
  }

  // Update the transaction status
  async updateTransactionStatus(tx_ref: string, status: string) {
    await TransactionModel.findOneAndUpdate({ tx_ref }, { status });
  }
}

export const paymentService = new PaymentService();
