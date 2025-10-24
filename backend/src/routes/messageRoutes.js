import express from 'express';
import {
    createMessage,
    getMessage,
    updateMessage,
    deleteMessage
    } from '../controllers/messageController.js';
import AuthMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', AuthMiddleware,  createMessage);
router.get('/', getMessage);
router.put('/:id', updateMessage);
router.delete('/:id', deleteMessage);

export default router;