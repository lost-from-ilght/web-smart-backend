import express from 'express';
const router = express.Router();
import humidityController from '../controllers/humidity_controller.js';

router.post('/create', humidityController.createHumidity);
router.get('/', humidityController.getHumidities);
router.get('/:id', humidityController.getHumidityById);
router.put('/:id', humidityController.updateHumidity);
router.delete('/:id', humidityController.deleteHumidity);

export default router;