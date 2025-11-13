import express from 'express';
import {
    createProduct,
    getProduct,
    getProductId,
    updateProduct,
    deleteProduct,
    myProducts,
    getProductsBySeller
    } from '../controllers/productController.js';
import AuthMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/mine', AuthMiddleware, myProducts);
router.get('/seller/:sellerId', getProductsBySeller);
router.post('/', AuthMiddleware, createProduct);
router.put('/:id', AuthMiddleware, updateProduct);
router.delete('/:id', AuthMiddleware, deleteProduct);

router.get('/', getProduct);
router.get('/:id', getProductId);



export default router;