import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';
import conversationRoutes from './routes/conversationRoutes.js';
import messageRoutes from './routes/messageRoutes.js';

const app = express();
connectDB();

dotenv.config();

app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/messages', messageRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;