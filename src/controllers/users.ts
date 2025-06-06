import { usersTable } from '@/db/schema.js';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { z } from 'zod/v4';
import config from '@config';
import logger from '@/util/index.js';
import { hashPassword } from '@/controllers/auth.js';

const LoginSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(255).transform(hashPassword),
});

const SignupSchema = LoginSchema.extend({ name: z.string().min(2).max(255) });

const db = drizzle(config.db.url!);

const createUser = async (userData: z.infer<typeof SignupSchema>) => {
  try {
    const user = await SignupSchema.parseAsync(userData);
    await db.insert(usersTable).values(user);
  } catch (err) {
    if (err instanceof z.ZodError) {
      logger.warn('Invalid user data');
      logger.info(err.issues);
      return err.issues;
    }
    throw err;
  }
  return;
};

const getUser = async (userData: z.infer<typeof SignupSchema>) => {
  const user = await db.select().from(usersTable).where(eq(usersTable.email, userData.email));
  logger.info(user);
  return user;
};

export { createUser, getUser, LoginSchema, SignupSchema };
