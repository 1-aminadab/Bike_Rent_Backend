import { Router } from 'express';
import { authenticateJWT, authorizeRoles } from '../../infrastructure/middleware/auth.middleware';
import { userController } from '../../application/controllers/user.controller';

const router = Router();

router.get('/all-user',  authenticateJWT, authorizeRoles('admin'), userController.getAllUsers);
router.get('/get-user/:id', authenticateJWT,authorizeRoles('admin'), userController.getUserById);
router.patch('/update-user/:id', authenticateJWT, authorizeRoles('admin'), userController.updateUser);
router.delete('/delete-user/:id', authenticateJWT, authorizeRoles('admin'), userController.deleteUser);

export default router;
