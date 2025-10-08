import Product from "../models/Product.js";
import asyncHandler from "express-async-handler";

// Create Product
export const createProduct = asyncHandler(async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.status(201).json(product);
});

// Get product
export const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.find();
  res.json(product);
});

// Get product by ID
export const getProductId = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Producto no encontrado');
  }
  res.json(product);
});

// Update product
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!product) {
    res.status(404);
    throw new Error('Producto no encontrado');
  }
  res.json(product);
});

// Delete product
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Producto no encontrado');
  }
  res.json({ message: 'Producto eliminado' });
});