import { usersTable } from '@/db/schema.js';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { z } from 'zod/v4';
import config from '@config';
import logger from '@/util/index.js';
import { hashPassword } from './auth.js';

const LoginSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(255),
});

const SignupSchema = LoginSchema.extend({ name: z.string().min(2).max(255) });

const db = drizzle(config.db.url!);

const createUser = async (userData: z.infer<typeof SignupSchema>) => {
  try {
    userData.password = await hashPassword(userData.password);
    await db.insert(usersTable).values(userData);
  } catch (err) {
    if (err instanceof z.ZodError) {
      logger.debug('Invalid user data');
      logger.debug(err.issues);
      return err.issues;
    }
    throw err;
  }
  return;
};

const getUser = async (email: string) => {
  try {
    logger.debug(email);
    const [user] = await db.selectDistinctOn([usersTable.id]).from(usersTable).where(eq(usersTable.email, email));
    logger.debug(user);
    return user;
  } catch (err) {
    logger.error(err);
  }
};

export { createUser, getUser, LoginSchema, SignupSchema };
