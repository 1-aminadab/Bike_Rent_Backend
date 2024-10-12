// application/routes/auth.routes.ts
import { Router } from 'express';
import { authenticateJWT, authorizeRoles } from '../../infrastructure/middleware/auth.middleware';
import { authController } from '../../application/controllers/auth.controller';
import { passwordResetController } from '../../application/controllers/password-reset.controller';

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/admin-login', authController.AdminLogin);
router.post('/logout', authenticateJWT, authController.logout);
router.post('/refresh-tokens', authController.refreshTokens);

// password reset controller
router.post('/send-otp/:phoneNumber', passwordResetController.sendOtp);
router.post('/verify-otp/:receivedOtp', passwordResetController.verifyOtp);
router.post('/verify-registration-otp/:receivedOtp', passwordResetController.verifyRegistrationOtp);
router.post('/change-password', passwordResetController.changePassword);
router.post('/forget-password', passwordResetController.forgetPassword);



export default router;
