// application/routes/auth.routes.ts
import { Router } from 'express';
import { authenticateJWT, authorizeRoles } from '../../infrastructure/middleware/auth.middleware';
import {
  register, login, refreshTokens, logout
} from '../../application/controllers/auth.controller';

const authRouter = Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', authenticateJWT, logout);
authRouter.post('/refresh-tokens', refreshTokens);

// Example of role-based route
authRouter.get('/admin', authenticateJWT, authorizeRoles('admin', 'super-admin'), (req, res) => {
  res.status(200).json({ message: 'Welcome Admin!' });
});

export default authRouter;
