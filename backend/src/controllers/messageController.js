import Message from "../models/Message.js";
import asyncHandler from "express-async-handler";

// Create Message
export const createMessage = asyncHandler(async (req, res) => {
  const message = new Message(req.body);
  await message.save();
  res.status(201).json(message);
});

// Get Message
export const getMessage = asyncHandler(async (req, res) => {
  const message = await Message.find();
  res.json(message);
});

// Get message by ID
export const getMessageId = asyncHandler(async (req, res) => {
  const message = await Message.findById(req.params.id);
  if (!message) {
    res.status(404);
    throw new Error('Mensaje no encontrado');
  }
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
  const message = await Message.findById(req.params.id);
  if (!message) {
    res.status(404);
    throw new Error('Mensaje no encontrado');
  }
  await message.remove();
  res.json({ message: 'Mensaje eliminado' });
});