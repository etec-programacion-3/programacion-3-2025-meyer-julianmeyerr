import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";
import asyncHandler from "express-async-handler";

// Create Message
export const createMessage = asyncHandler(async (req, res) => {
  const {conversationId, content} = req.body;

  const conversation = await Conversation.findById(conversationId);
  
  if (!conversation) {
    res.status(404);
    throw new Error('Conversación no encontrada');
  }

  if (!conversation.members.includes(req.user._id)) {
    res.status(403);
    throw new Error("No autorizado para enviar mensajes en esta conversación");
  }

  const message = new Message({
    conversationId: conversationId,
    senderId: req.user._id,
    content: content,
  });

  await message.save();
  res.status(201).json(message);
});

// Get Message
export const getMessage = asyncHandler(async (req, res) => {
  const message = await Message.find();
  res.json(message);
});

// Update message
export const updateMessage = asyncHandler(async (req, res) => {
  const message = await Message.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!message) {
    res.status(404);
    throw new Error('Mensaje no encontrado');
  }
  res.json(message);
});

// Delete message
export const deleteMessage = asyncHandler(async (req, res) => {
  const message = await Message.findByIdAndDelete(req.params.id);
  if (!message) {
    res.status(404);
    throw new Error('Mensaje no encontrado');
  }
  res.json({ message: 'Mensaje eliminado' });
});