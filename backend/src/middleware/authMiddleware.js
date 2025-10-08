import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

const authMiddleware = asyncHandler(async (req, res, next) => {
    const  authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401);
        throw new Error('No autorizado, token faltante');
    }
    
    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-passwordHash');

        if (!user) {
            res.status(404);
            throw new Error('usuario no encontrado');
        }

        req.user = user;
        next();
    }
    catch (error) {
        res.status(401);
        throw new Error('token inválido');
    }
});

export default authMiddleware;
