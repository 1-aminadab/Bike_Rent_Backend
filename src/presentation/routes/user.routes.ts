import { Router } from 'express';
import { authenticateJWT, authorizeRoles } from '../../infrastructure/middleware/auth.middleware';
import { userController } from '../../application/controllers/user.controller';
import { passwordResetController } from '../../application/controllers/password-reset.controller';

const router = Router();

router.get('/all-user',authenticateJWT,authorizeRoles('admin'), userController.getAllUsers);
router.get('/admins', authenticateJWT,authorizeRoles('admin'),  userController.getAdmins);
router.get('/sub-admins', authenticateJWT,authorizeRoles('admin'),userController.getSubAdmins);

// router.get('/get-user/:id', authenticateJWT,authorizeRoles('admin'), userController.getUserById);
router.get('/get-user/:id', userController.getUserById);

router.patch('/update-user/:id',   userController.updateUser);
router.patch('/update-sub-admin/:id',   userController.updateSubAdmin);
router.patch('/update-admin/:id',   userController.updateAdmin);
router.patch('/update-sub-admin-password/:id',   passwordResetController.changePasswordByAdmin);

router.delete('/delete-user/:id',  userController.deleteUser);
router.delete('/delete-all-user', userController.deleteAllUsers)
router.delete('/delete-sub-admin/:id',  userController.deleteSubAdmin);
router.delete('/delete-admin/:id',  userController.deleteAdmin);

router.get('/customers/status', userController.getCustomerStats);
router.get('/customers/:timeFrame', userController.getCustomersByTimeFrame);

export default router;
