import mongoose from "mongoose";
const { Schema, Types} = mongoose;

const productSchema = new Schema({
  name: { type: String, required: true },
  description : { type: String },
  price: { type: Number, required: true },
  stock: { type: Number, default: 1 },
  sellerId : { type: Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

const Product = mongoose.model('Product', productSchema);

export default Product;