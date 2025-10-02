import User from "../models/User.js";
import asyncHandler from "express-async-handler";

// Create User
export const createUser = asyncHandler(async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.status(201).json(user);
});

// Get users
export const getUser = asyncHandler(async (req, res) => {
  const user = await User.find();
  res.json(user);
});

// Get user by ID
export const getUserId = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('Usuario no encontrado');
  }
  res.json(usuario);
});

// Update user
export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!user) {
    res.status(404);
    throw new Error('Usuario no encontrado');
  }
  res.json(user);
});

// Eliminar usuario
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('Usuario no encontrado');
  }
  await user.remove();
  res.json({ message: 'Usuario eliminado' });
});