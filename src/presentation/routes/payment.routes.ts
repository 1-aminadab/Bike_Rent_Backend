// routes/paymentRoutes.ts
import { Router } from 'express';
import { paymentController } from '../../application/controllers/paymentController';
import { transactionController } from '../../application/controllers/Transaction.Controller';
import { authenticateJWT, authorizeRoles } from '../../infrastructure/middleware/auth.middleware';

const PaymentRouter = Router();

PaymentRouter.post('/pay', paymentController.initiatePayment);
PaymentRouter.get('/verify/:tx_ref', paymentController.verifyPayment);

PaymentRouter.get('/all',authenticateJWT,authorizeRoles('admin'), transactionController.getAllTransactions);
PaymentRouter.get('/history/:userId', transactionController.getTransactionHistory);
PaymentRouter.get('/verify', transactionController.verifyTransaction);
PaymentRouter.get('/revenue',authenticateJWT,authorizeRoles('admin'), transactionController.getTotalRevenue);
PaymentRouter.get('/payment_method', transactionController.filterTransactionsByMethod);
PaymentRouter.get('/transactions/:timeFrame', transactionController.getTransactionsByTimeFrame);

PaymentRouter.patch('/:id', transactionController.updateTransaction);
PaymentRouter.delete('/:id', transactionController.deleteTransaction);
PaymentRouter.get('/status/:status', transactionController.getTransactionByStatus);

export default PaymentRouter;



