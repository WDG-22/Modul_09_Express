import express from 'express';
import userRouter from './routers/user.router.js';
import postsRouter from './routers/posts.router.js';

const app = express();
const port = process.env.PORT || 8080;
app.use(express.json());

app.use('/users', userRouter);
app.use('/posts', postsRouter);

app.listen(port, () => console.log(`Server is running on port ${port}`));
