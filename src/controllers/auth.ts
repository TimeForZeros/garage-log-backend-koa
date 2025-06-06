import jwt from 'jsonwebtoken';
import logger from '@/util/index.js';
import config from '@config';
import { argon2id, argon2Verify } from 'hash-wasm';
import { randomBytes } from 'crypto';

const ARGON2ID_CONFIG = {
  // OWASP recommended config
  iterations: 2,
  parallelism: 1,
  memorySize: 1024 * 19, // 19 MiB
  hashLength: 32,
  outputType: 'encoded' as const,
  secret: process.env.PEPPER,
};

export const hashPassword = (password: string): Promise<string> =>
  argon2id({
    ...ARGON2ID_CONFIG,
    password,
    salt: randomBytes(16),
  });

export const authenticate = (password: string, hash: string) =>
  argon2Verify({ password, hash, secret: config.db.pepper });

export const verify = (token: string) => {
  try {
    const payload = jwt.verify(token, 'fwiggle');
    logger.info(payload);
    if (payload) return payload;
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      logger.warn(err.message);
    } else {
      logger.error(err);
    }
  }
  return;
};
