import express from 'express';
const router = express.Router();
import acController from '../controllers/ac_controller.js';

router.post('/create', acController.createAc);
router.get('/', acController.getAcs);
router.get('/:id', acController.getAcById);
router.put('/:id', acController.updateAc);
router.delete('/:id', acController.deleteAc);

export default router;