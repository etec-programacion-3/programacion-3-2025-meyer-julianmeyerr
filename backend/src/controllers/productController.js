import Product from "../models/Product.js";
import User from "../models/User.js";
import asyncHandler from "express-async-handler";

// Create Product
export const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, stock } = req.body;
  const product = new Product({
    name,
    description,
    price,
    stock,
    sellerId: req.user._id,
  });
  await product.save();
  res.status(201).json(product);
});

// Get product
export const getProduct = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  const search = req.query.search
    ?{
      $or: [
        { name: { $regex: req.query.search, $options: "i" } },
        { description: { $regex: req.query.search, $options: "i" } }
      ]}
    : {};
  
  const totalItems = await Product.countDocuments(search);
  const product = await Product.find(search).skip(skip).limit(limit)
  .populate({
    path: 'sellerId',
    select: 'name'
  });
  res.json({
    page,
    limit,
    totalItems,
    totalPages: Math.ceil(totalItems / limit),
    product
  });
});

// Get product by ID
export const getProductId = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  const seller = await User.findById(product.sellerId).select('name');
  if (!product) {
    res.status(404);
    throw new Error('Producto no encontrado');
  }
  res.json({product, seller});
});

// Update product
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Producto no encontrado');
  }
  if (product.sellerId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('No autorizado para actualizar este producto');
  }
  await product.updateOne(req.body);
  const updatedproduct = await Product.findById(req.params.id);
  res.json(updatedproduct);
});


// Delete product
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Producto no encontrado');
  }
  if (product.sellerId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('No autorizado para eliminar este producto');
  }
  await product.deleteOne();
  res.json({ message: 'Producto eliminado' });
});

// Get my products
export const myProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ sellerId: req.user._id });
  res.json(products);
});