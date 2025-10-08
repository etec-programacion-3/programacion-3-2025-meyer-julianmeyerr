import userRoutes from './userRoutes.js';
import productRoutes from './productRoutes.js';
import conversationRoutes from './conversationRoutes.js';
import messageRoutes from './messageRoutes.js';
import authRoutes from './authRoutes.js';
import profileRoutes from './profileRoutes.js';

export default [
  { path: '/api/users', router: userRoutes },
  { path: '/api/products', router: productRoutes },
  { path: '/api/conversations', router: conversationRoutes },
  { path: '/api/messages', router: messageRoutes },
  { path: '/api/auth', router: authRoutes },
  { path: '/api/profile', router: profileRoutes },
];