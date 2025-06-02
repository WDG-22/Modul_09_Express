import { Router } from 'express';
import { User, Note, UsersNotes } from '../models/associations.js';
import { getAllUsers, createUser, getOneUser, updateUser, deletUser } from '../controllers/user.controllers.js';

const userRouter = Router();

userRouter.get('/', getAllUsers);
userRouter.post('/', createUser);
userRouter.get('/:id', getOneUser);
userRouter.put('/:id', updateUser);
userRouter.delete('/:id', deletUser);

export default userRouter;
