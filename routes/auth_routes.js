import express from 'express';
const router = express.Router();
import authController from '../controllers/auth_controller.js';

router.post('/login', authController.login);

export default router;