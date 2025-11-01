import express from 'express';
const router = express.Router();
import musicController from '../controllers/music_controller.js';

router.post('/create', musicController.createMusic);
router.get('/', musicController.getMusicDevices);
router.get('/:id', musicController.getMusicDeviceById);
router.put('/:id', musicController.updateMusicDevice);
router.delete('/:id', musicController.deleteMusicDevice);

export default router;