import express from 'express';
import productController from '../controllers/productController.js'

const router = express.Router();

router.get('/', productController.get);
router.post('/', productController.add);
router.put('/:id', productController.update);
router.delete('/:id', productController.delete);

export default router;