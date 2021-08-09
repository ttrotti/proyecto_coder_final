import express from 'express';
import cartController from '../controllers/cartController.js'

const router = express.Router();

router.post('/place-order', cartController.placeOrder)

router.get('/', cartController.get);
router.post('/:id', cartController.add);
router.delete('/:id', cartController.delete);

export default router;