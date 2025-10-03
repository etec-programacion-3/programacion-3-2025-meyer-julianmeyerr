import User from "../models/User.js";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    //1. validar campos
    if (!name || !email || !password) {
        res.status(400);
        throw new Error('Por favor, completa todos los campos');
    }

    //2. verificar si el usuario ya existe
    const userExists = await User.findOne({ email }); 
        if (userExists) {
            res.status(400);
            throw new Error('El usuario ya existe');
    }

    //3. Hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //4. Crear el usuario
    const user = await User.create({
        email,
        passwordHash: hashedPassword,
        name
    });

    //5. Devolver respuesta y token
    if (user) {
        res.status(201).json({
            _id: user._id,
            email: user.email,
            name: user.name,
            token: generateToken(user._id)
        });
    }
});

export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    //1. Buscar el usuario
    const user = await User.findOne({ email });
    if (!user) {
        res.status(400);
        throw new Error('Credenciales inválidas');
    }

    //2. Verificar la contraseña
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
        res.status(400);
        throw new Error('Credenciales inválidas');
    }

    //3. Devolver respuesta y token
    res.json({
        _id: user._id,
        email: user.email,
        name: user.name,
        token: generateToken(user._id)
    });
});

const generateToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET, 
        {expiresIn: process.env.JWT_EXPIRES_IN});
}