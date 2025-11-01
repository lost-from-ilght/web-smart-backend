import express from 'express';
const router = express.Router();
import commandController from '../controllers/command_controller.js';

router.post('/:id', commandController.sendCommands);
router.post('/divider/:id', commandController.sendCommandsToDivider);

export default router;