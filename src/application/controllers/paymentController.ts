// controllers/PaymentController.ts
import { Request, Response } from 'express';
import { paymentService } from '../service/PaymentService.service';
import { PaymentType } from '../../domain/enums/user.enum';


class PaymentController {
  async initiatePayment(req: Request, res: Response) {
    try {
      const { userId, amount, payment_method = PaymentType.Electronic} = req.body;

      // Call the service to initialize payment
      const paymentResponse = await paymentService.initializePayment(userId, amount, payment_method);

      // Redirect the user to the checkout URL provided by Chapa
      res.status(200).json({ data:paymentResponse });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Verify the transaction by tx_ref
  async verifyPayment(req: Request, res: Response) {
    try {
      const { tx_ref } = req.params;

      // Call the service to verify the transaction
      const verificationResponse:any = await paymentService.verifyPayment(tx_ref);

      // Update the transaction status based on the verification response
      if (verificationResponse.data.status === 'success') {
        await paymentService.updateTransactionStatus(tx_ref, 'successful');
      } else {
        await paymentService.updateTransactionStatus(tx_ref, 'failed');
      }

      res.json(verificationResponse.data);
    } catch (error:any) {
      res.status(500).json({ message: error.message });
    }
  }
}

export const paymentController = new PaymentController();
