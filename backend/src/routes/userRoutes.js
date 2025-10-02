import express from 'express';
import {
  createUser,
  getUser,
  getUserId,
  updateUser,
  deleteUser
} from '../controllers/userController.js';

const router = express.Router();

router.post('/', createUser);
router.get('/', getUser);
router.get('/:id', getUserId);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;