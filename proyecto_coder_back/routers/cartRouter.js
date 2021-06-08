import express from 'express';
import cartController from '../controllers/cartController.js'

const router = express.Router();

router.get('/:id?', cartController.get);
router.post('/:id', cartController.add);
router.delete('/:id', cartController.delete);

export default router;