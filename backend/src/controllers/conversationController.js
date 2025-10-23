import Conversation from "../models/Conversation.js";
import Product from "../models/Product.js";
import asyncHandler from "express-async-handler";

// Create Conversation
export const createConversation = asyncHandler(async (req, res) => {
  const { productId }=  req.body;
  const product = await Product.findById(productId);

  if(!product){
    res.status(404);
    throw new Error('Producto no encontrado');
  }

  const existingConversation = await Conversation.findOne({
    members: { $all: [req.user._id, product.sellerId] },
    productId: productId
  });

  if (existingConversation) {
    return res.status(200).json(existingConversation);
  }

  const conversation = new Conversation({
    members: [req.user._id, product.sellerId],
    productId: productId
  });
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

// Get my conversations
export const myConversations = asyncHandler(async (req, res) => {
  const conversations = await Conversation.find({ members: req.user._id });
  res.json(conversations);
});