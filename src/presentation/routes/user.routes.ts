import { Router } from 'express';
import { authenticateJWT, authorizeRoles } from '../../infrastructure/middleware/auth.middleware';
import { userController } from '../../application/controllers/user.controller';
import { passwordResetController } from '../../application/controllers/password-reset.controller';

const router = Router();

router.get('/all-user', userController.getAllUsers);
router.get('/admins',  userController.getAdmins);
router.get('/sub-admins', userController.getSubAdmins);

router.get('/get-user/:id', userController.getUserById);

router.patch('/update-user/:id',   userController.updateUser);
router.patch('/update-sub-admin/:id',   userController.updateSubAdmin);
router.patch('/update-sub-admin-password/:id',   passwordResetController.changePasswordByAdmin);

router.delete('/delete-user/:id',  userController.deleteUser);
router.delete('/delete-all-user', userController.deleteAllUsers)
router.delete('/delete-sub-admin/:id',  userController.deleteSubAdmin);
router.delete('/delete-admin/:id',  userController.deleteAdmin);

export default router;
