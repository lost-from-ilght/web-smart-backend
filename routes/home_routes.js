import express from 'express';
const router = express.Router();
import homeController from '../controllers/home_controllers.js';

router.get('/', homeController.gethomes);
router.post('/', homeController.createhome);
router.get('/:id', homeController.gethomeById);
router.put('/:id', homeController.updatehome);
router.delete('/:id', homeController.deletehome);
router.get('/change_activity/:id', homeController.changeActivityOfHome);


export default router;