import dotenv from 'dotenv';

const env = process.env.NODE_ENV ?? 'default';
dotenv.config({ path: `../../.env.${env}` });

export default {
  env,
  port: process.env.PORT,
  db: {
    postgres: {
      port: process.env.PGPORT,
      user: process.env.PGUSER,
      password: process.env.PGPASS,
      host: process.env.HOST,
      name: process.env.PGDATABASE,
    },
  },
  pepper: process.env.PEPPER,
  secret: process.env.SECRET as string,
};
