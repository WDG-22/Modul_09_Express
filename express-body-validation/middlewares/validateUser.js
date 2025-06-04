import userSchema from '../schemas/user.schema.js';
import { z } from 'zod/v4';

const validateUser = (req, res, next) => {
  const { error, data } = userSchema.safeParse(req.body);

  if (error) {
    // console.log(z.prettifyError(error));
    throw new Error(z.prettifyError(error), { cause: 400 });
  }

  console.log(data);
  next();
};

export default validateUser;
