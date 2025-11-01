import express from 'express';
const router = express.Router();
import onOffController from '../controllers/onoff_controller.js';

router.post('/create', onOffController.createOnOff);
router.get('/', onOffController.getOnOffs);
router.get('/:id', onOffController.getOnOffById);
router.put('/:id', onOffController.updateOnOff);
router.delete('/:id', onOffController.deleteOnOff);

export default router;