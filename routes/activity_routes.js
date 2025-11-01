import express from 'express';
const router = express.Router();
import activityController from '../controllers/activity_controller.js';


router.post('/:id', activityController.sendActivity);
router.get('/check/:id', activityController.checkActivity);

export default router;