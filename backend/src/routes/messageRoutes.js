import express from 'express';
import {
    createMessage,
    getMessage,
    getMessageId,
    updateMessage,
    deleteMessage
    } from '../controllers/messageController.js';

const router = express.Router();

router.post('/', createMessage);
router.get('/', getMessage);
router.get('/:id', getMessageId);
router.put('/:id', updateMessage);
router.delete('/:id', deleteMessage);

export default router;