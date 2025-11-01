import express from 'express';
const router = express.Router();
import gasController from '../controllers/gas_controller.js';

router.post('/create', gasController.createGas);
router.get('/', gasController.getGasSensors);
router.get('/:id', gasController.getGasSensorById);
router.put('/:id', gasController.updateGasSensor);
router.delete('/:id', gasController.deleteGasSensor);

export default router;