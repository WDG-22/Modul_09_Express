import express from 'express';
import cors from 'cors';
import chalk from 'chalk';
import userRouter from './routers/user.router.js';
import noteRouter from './routers/note.router.js';

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ msg: 'Server healthy' });
});

app.use('/users', userRouter);
app.use('/notes', noteRouter);

app.listen(port, () => console.log(chalk.bgGreen(` CRUD Operations listening on port ${port}  `)));
