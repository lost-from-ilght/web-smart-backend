import express from 'express';
const router = express.Router();
import fireController from '../controllers/fire_controller.js';

router.post('/create', fireController.createFire);
router.get('/', fireController.getFireSensors);
router.get('/:id', fireController.getFireSensorById);
router.put('/:id', fireController.updateFireSensor);
router.delete('/:id', fireController.deleteFireSensor);

export default router;