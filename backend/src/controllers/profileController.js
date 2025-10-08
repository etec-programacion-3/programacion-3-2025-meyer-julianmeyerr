import asyncHandler from "express-async-handler";

// Get current user profile
export const getProfile = (req, res) => {res.json(req.user)}
