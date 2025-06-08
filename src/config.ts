const config = {
  env: process.env.NODE_ENV,
  host: process.env.HOST,
  port: process.env.PORT,
  db: {
    port: process.env.PGPORT,
    user: process.env.PGUSER as string,
    password: process.env.PGPASS,
    host: process.env.PGHOST,
    name: process.env.PGDATABASE,
    url: process.env.DATABASE_URL,
    pepper: process.env.PEPPER,
  },
  secret: process.env.SECRET as string,
  logLevel: process.env.LOG_LEVEL || 'info',
};

export default config;
