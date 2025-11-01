import express from 'express';
const router = express.Router();
import tvController from '../controllers/tv_controller.js';

router.post('/create', tvController.createTv);
router.get('/', tvController.getTvs);
router.get('/:id', tvController.getTvById);
router.put('/:id', tvController.updateTv);
router.delete('/:id', tvController.deleteTv);

export default router;