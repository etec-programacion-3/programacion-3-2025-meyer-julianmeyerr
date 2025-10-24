import express from 'express';
import {
    createConversation,
    getConversation,
    getConversationId,
    updateConversation,
    deleteConversation,
    myConversations
    } from '../controllers/conversationController.js';
import AuthMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/',AuthMiddleware, createConversation);
router.get('/', getConversation);
router.get('/mine', AuthMiddleware, myConversations);
router.get('/:id', AuthMiddleware, getConversationId);
router.put('/:id', AuthMiddleware, updateConversation);
router.delete('/:id', deleteConversation);

export default router;