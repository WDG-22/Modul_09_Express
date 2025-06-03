import { z } from 'zod/v4';

const UserSchema = z.object({
  firstName: z.string().max(50),
  lastName: z.string(),
  email: z.email(),
});

const validateUserBody = (req, res, next) => {
  const data = UserSchema.safeParse(req.body);
  console.log(data);
  if (!data.success) throw new Error('Validation error', { cause: { statusCode: 400 } });

  next();
};

export default validateUserBody;
