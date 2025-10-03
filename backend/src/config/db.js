import mongoose from "mongoose";

const conectarDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/ecommerce');
    console.log('MongoDB conectado');
  } catch (err) {
    console.error('Error conectando a MongoDB:', err.message);
    process.exit(1);
  }
};
export default conectarDB;