import express from 'express';
const router = express.Router();
import officeController from '../controllers/office_controlers.js';

router.get('/', officeController.getoffices);
router.post('/', officeController.createoffice);
router.get('/:id', officeController.getofficeById);
router.put('/:id', officeController.updateoffice);
router.delete('/:id', officeController.deleteoffice);
router.get('/change_activity/:id', officeController.changeActivityOfoffice);


export default router;