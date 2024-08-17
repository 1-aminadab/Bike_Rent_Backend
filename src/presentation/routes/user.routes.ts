import { Router } from 'express';
import { authenticateJWT } from '../../infrastructure/middleware/auth.middleware';
import { userController } from '../../application/controllers/user.controller';

const router = Router();

router.get('/all-user', authenticateJWT, userController.getAllUsers);
router.get('/get-user/:id', authenticateJWT, userController.getUserById);
router.patch('/update-user/:id', authenticateJWT, userController.updateUser);
router.delete('/delete-user/:id', authenticateJWT, userController.deleteUser);

export default router;
