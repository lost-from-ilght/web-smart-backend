import express from 'express';
const router = express.Router();
import dangerController from '../controllers/danger_controller.js';

router.post('/', dangerController.createDanger);
router.get('/:id', dangerController.getAllDangers);
router.get('/find/:id', dangerController.getDangerById);
router.put('/:id', dangerController.updateDanger);
router.delete('/:id', dangerController.deleteDanger);

export default router;