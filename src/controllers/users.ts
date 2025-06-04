import 'dotenv/config';
import { usersTable } from '@/db/schema.js';
import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import { argon2id, argon2Verify } from 'hash-wasm';
import crypto from 'crypto';
import { z } from 'zod/v4';

const ARGON2ID_CONFIG = {
  // OWASP recommended config
  iterations: 2,
  parallelism: 1,
  memorySize: 1024 * 19, // 19 MiB
  hashLength: 32,
  outputType: 'encoded' as 'encoded',
  secret: process.env.PEPPER,
};

const LoginSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(8)
    .max(255)
    .transform(async (pass) =>
      argon2id({
        ...ARGON2ID_CONFIG,
        password: pass,
        salt: crypto.randomBytes(16),
      }),
    ),
});

const SignupSchema = LoginSchema.extend({ name: z.string().min(2).max(255) });

const db = drizzle(process.env.DATABASE_URL!);

const createUser = async (userData: any) => {
  const response: Record<string, any> = { status: 200 };
  try {
    const user = await SignupSchema.parseAsync(userData);
    await db.insert(usersTable).values(user);
  } catch (err) {
    if (err instanceof z.ZodError) {
      console.error('Invalid user data');
      response.status = 400;
      console.log(err.issues);
      response.body = err.issues;
    } else {
      console.error(err);
      response.status = 500;
      response.body = 'An unknown error has occurred';
    }
  }
  return response;
};

// const verify = await argon2Verify({ password: userData.password, hash: hashPassword, secret: process.env.PEPPER });
export { createUser, LoginSchema, SignupSchema };
