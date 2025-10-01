import express from 'express';
import {
    createProduct,
    getProduct,
    getProductId,
    updateProduct,
    deleteProduct
    } from '../controllers/productController.js';

const router = express.Router();

router.post('/', createProduct);
router.get('/', getProduct);
router.get('/:id', getProductId);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;