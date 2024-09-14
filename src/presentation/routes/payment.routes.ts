// routes/paymentRoutes.ts
import { Router } from 'express';
import { paymentController } from '../../application/controllers/paymentController';
import { transactionController } from '../../application/controllers/Transaction.Controller';

const PaymentRouter = Router();

PaymentRouter.post('/pay', paymentController.initiatePayment);
PaymentRouter.get('/verify/:tx_ref', paymentController.verifyPayment);

PaymentRouter.get('/all', transactionController.getAllTransactions);
PaymentRouter.get('/history/:userId', transactionController.getTransactionHistory);
PaymentRouter.get('/verify', transactionController.verifyTransaction);
export default PaymentRouter;



