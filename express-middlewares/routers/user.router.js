import { Router } from 'express';
import { User, Note, UsersNotes } from '../models/associations.js';
import { getAllUsers, createUser, getOneUser, updateUser, deletUser } from '../controllers/user.controllers.js';
import validateUserBody from '../middlewares/validateUserBody.js';

const myMiddleware = (req, res, next) => {
  console.log('GETTING ONE USER');
  next();
  // console.log('Nach aufruf von next()');
};

const userRouter = Router();

userRouter.get('/', getAllUsers);

userRouter.use((req, res, next) => {
  console.log('User Router hit');
  next();
});

userRouter.post('/', validateUserBody, createUser);
userRouter.get(
  '/:id',
  myMiddleware,
  (req, res, next) => {
    console.log('And another one');
    next();
  },
  getOneUser
);
userRouter.put('/:id', validateUserBody, updateUser);
userRouter.delete('/:id', deletUser);

export default userRouter;
