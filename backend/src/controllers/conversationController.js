import Conversation from "../models/Conversation.js";
import Product from "../models/Product.js";
import Message from "../models/Message.js";
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
    throw new Error("Conversación no encontrada");
  }

  if (!conversation.members.includes(req.user._id)) {
    res.status(403);
    throw new Error("No autorizado para ver mensajes en esta conversación");
  }

  const conversationData = await Conversation.findById(req.params.id)
    .populate("members", "name")
    .populate("productId", "name");

  const page = Number(req.query.page) || 1;
  const limit = 15;
  const skip = (page - 1) * limit;

  // ✅ Traer mensajes con nombre del remitente
  const messages = await Message.find({ conversationId: conversation._id })
    .populate("senderId", "name")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .select("-__v")
    .lean()
    .exec();

  messages.reverse();

  res.json({ conversation: conversationData, messages });
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
  const page = Number(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  const totalItems = await Conversation.countDocuments({ members: req.user._id });
  const conversations = await Conversation.find({ members: req.user._id }).skip(skip).limit(limit).populate("members", "name").populate("productId","name");

  const conversationsWithLastMessage = await Promise.all(
    conversations.map(async (conv) => {
      // Obtener último mensaje
      const lastMessage = await Message.find({ conversationId: conv._id }).select('-conversationId -_id')
        .sort({ createdAt: -1 })
        .limit(1);
  
      return {...conv.toObject(), lastMessage: lastMessage[0] || null };
    })
  );
  res.json({page,
    limit,
    totalItems,
    totalPages: Math.ceil(totalItems / limit),
    conversations: conversationsWithLastMessage});
});