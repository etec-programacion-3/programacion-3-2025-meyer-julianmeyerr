import express from 'express';
import {
    createConversation,
    getConversation,
    getConversationId,
    updateConversation,
    deleteConversation
    } from '../controllers/conversationController.js';

const router = express.Router();

router.post('/', createConversation);
router.get('/', getConversation);
router.get('/:id', getConversationId);
router.put('/:id', updateConversation);
router.delete('/:id', deleteConversation);

export default router;