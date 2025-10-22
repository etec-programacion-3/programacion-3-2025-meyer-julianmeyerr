import express from 'express';
import {
    createProduct,
    getProduct,
    getProductId,
    updateProduct,
    deleteProduct,
    myProducts
    } from '../controllers/productController.js';
import AuthMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/my-products', AuthMiddleware, myProducts);
router.post('/', AuthMiddleware, createProduct);
router.put('/:id', AuthMiddleware, updateProduct);
router.delete('/:id', AuthMiddleware, deleteProduct);

router.get('/', getProduct);
router.get('/:id', getProductId);



export default router;