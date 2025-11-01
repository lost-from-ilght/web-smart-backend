import express from 'express';
const router = express.Router();
import temperatureController from '../controllers/temperature_controller.js';

router.post('/create', temperatureController.createTemperature);
router.get('/', temperatureController.getTemperatures);
router.get('/:id', temperatureController.getTemperatureById);
router.put('/:id', temperatureController.updateTemperature);
router.delete('/:id', temperatureController.deleteTemperature);

export default router;