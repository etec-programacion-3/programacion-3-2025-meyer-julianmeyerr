import Conversation from "../models/Conversation.js";
import asyncHandler from "express-async-handler";

// Create Conversation
export const createConversation = asyncHandler(async (req, res) => {
  const conversation = new Conversation(req.body);
  await conversation.save();
  res.status(201).json(conversation);
});

// Get Conversation
export const getConversation = asyncHandler(async (req, res) => {
  const conversation = await Conversation.find();
  res.json(conversation);
});

// Get conversation by ID
export const getConversationId = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findById(req.params.id);
  if (!conversation) {
    res.status(404);
    throw new Error('Conversacion no encontrado');
  }
  res.json(conversation);
});

// Update conversation
export const updateConversation = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!conversation) {
    res.status(404);
    throw new Error('Conversacion no encontrado');
  }
  res.json(conversation);
});

// Delete conversation
export const deleteConversation= asyncHandler(async (req, res) => {
  const conversation = await Conversation.findByIdAndDelete(req.params.id);
  if (!conversation) {
    res.status(404);
    throw new Error('Conversacion no encontrado');
  }
  res.json({ message: 'Conversacion eliminado' });
});