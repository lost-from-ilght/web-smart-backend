import express from 'express';
const router = express.Router();
import notificationController from '../controllers/notification_controller.js';

router.post('/create', notificationController.createNotification);
router.get('/:home_id', notificationController.getUserNotifications);
router.get('/read/:id', notificationController.markAsRead);

router.delete('/:id', notificationController.deleteNotification);

export default router;