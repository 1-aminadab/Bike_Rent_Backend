// application/routes/auth.routes.ts
import { Router } from 'express';
import { authenticateJWT, authorizeRoles } from './infrastructure/middleware/auth.middleware';
import {
  register, login, refreshTokens, logout
} from './application/controllers/auth.controller';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', authenticateJWT, logout);
router.post('/refresh-tokens', refreshTokens);

// Example of role-based route
router.get('/admin', authenticateJWT, authorizeRoles('admin', 'super-admin'), (req, res) => {
  res.status(200).json({ message: 'Welcome Admin!' });
});

export default router;
