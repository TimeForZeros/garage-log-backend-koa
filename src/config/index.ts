import dotenv from 'dotenv';

const env = process.env.NODE_ENV ?? 'default';
dotenv.config({ path: `../../.env.${env}` });

export default {
  env,
  port: process.env.PORT,
  db: {
    port: process.env.PGPORT,
  },
};
