import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import chalk from 'chalk';
import userRouter from './routers/user.router.js';
import noteRouter from './routers/note.router.js';
import { errorHandler } from './utils/errorHandler.js';

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.use(morgan('dev'));

app.use((req, res, next) => {
  console.log('IP: ', req.ip);
  if (new Date().getDay() === 2) next();
  else res.send("It's not a valid day in the week");
});

app.get('/', async (req, res) => {
  throw new Error('Gremlin', { cause: { statusCode: 418 } });

  res.json({ msg: 'Server healthy' });
});

app.use('/users', userRouter);
app.use('/notes', noteRouter);

app.all('/{*splat}', () => {
  throw new Error('Page not found', { cause: { statusCode: 404 } });
});

app.use(errorHandler);

app.listen(port, () => console.log(chalk.bgGreen(` Server listening on port ${port}  `)));
