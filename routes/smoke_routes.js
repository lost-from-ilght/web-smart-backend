import express from 'express';
const router = express.Router();
import smokeController from '../controllers/smoke_controller.js';

router.post('/create', smokeController.createSmoke);
router.get('/', smokeController.getSmokeSensors);
router.get('/:id', smokeController.getSmokeSensorById);
router.put('/:id', smokeController.updateSmokeSensor);
router.delete('/:id', smokeController.deleteSmokeSensor);

export default router;