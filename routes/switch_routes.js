import express from 'express';
const router = express.Router();
import switchController from '../controllers/switch_controller.js';

router.post('/create', switchController.createSwitch);
router.get('/', switchController.getSwitches);
router.get('/:id', switchController.getSwitchById);
router.put('/:id', switchController.updateSwitch);
router.delete('/:id', switchController.deleteSwitch);

export default router;