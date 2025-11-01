import express from 'express';
const router = express.Router();
import roomController from '../controllers/room_controller.js';

router.post('/create', roomController.createRoom);
router.get('/:id', roomController.getRooms);
router.get('/find/:id', roomController.getRoomById);
router.put('/:id', roomController.updateRoom);
router.delete('/:id', roomController.deleteRoom);

export default router;