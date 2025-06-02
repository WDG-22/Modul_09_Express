import { Router } from 'express';
import { getPosts, createPost, getPostById, updatePost, deletePost } from '../controllers/posts.controllers.js';

const postsRouter = Router();

postsRouter.get('/', getPosts);
postsRouter.post('/', createPost);
postsRouter.get('/:id', getPostById);
postsRouter.put('/:id', updatePost);
postsRouter.delete('/:id', deletePost);

export default postsRouter;
