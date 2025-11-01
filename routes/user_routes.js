import express from 'express';
const router = express.Router();
import userController from '../controllers/user_controller.js';

router.post('/', userController.createUser);
router.get('/:id', userController.getUsers);
router.get('/find/:id', userController.getUserById);
router.get('/home/:home_id', userController.getUsersByHome);
router.put('/:id', userController.updateUser);
router.put('/pushToken/:id', userController.updateUserToken);
router.put('/password/:id', userController.updatePassword);
router.delete('/:id', userController.deleteUser);

export default router;