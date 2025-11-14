import express from 'express';
const router = express.Router();
import commandController from '../controllers/command_controller.js';

router.post('/:id', commandController.sendCommands);

export default router;