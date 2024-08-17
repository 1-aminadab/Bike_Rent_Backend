// application/routes/auth.routes.ts
import { Router } from 'express';
import { authenticateJWT, authorizeRoles } from '../../infrastructure/middleware/auth.middleware';
import { authController } from '../../application/controllers/auth.controller';
import { passwordResetController } from '../../application/controllers/password-reset.controller';

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authenticateJWT, authController.logout);
router.post('/refresh-tokens', authController.refreshTokens);

// password reset controller
router.post('/send-otp/:phoneNumber', passwordResetController.sendOtp);
router.post('/verify-otp/:receivedOtp', passwordResetController.sendOtp);
router.post('/change-password/:newPassword', passwordResetController.sendOtp);

// Example of role-based route
router.get('/admin', authenticateJWT, authorizeRoles('admin', 'super-admin'), (req, res) => {
  res.status(200).json({ message: 'Welcome Admin!' });
});

export default router;
