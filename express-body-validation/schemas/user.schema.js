import { z } from 'zod/v4';

const userSchema = z.object({
  firstName: z
    .string('First name must be a string')
    .min(1, 'First name must be at least 1 character')
    .max(255, 'First name must be at most 255 characters'),
  lastName: z
    .string('Last name must be a string')
    .min(1, 'Last name must be at least 1 character')
    .max(255, 'Last name must be at most 255 characters'),
  email: z.email('Must be a valid email'),
});

export default userSchema;
