import Koa from 'koa';
import Router from 'koa-router';
import bodyparser from 'koa-bodyparser';
import authRouter from '@/routes/auth.js';
import userRouter from '@/routes/users.js';
// import pgConnect from '@/db.js';
// import '@/db/index.js';
import logger from '@/util/index.js';
import config from '@config';

logger.info(`Environment: ${config.env}`);

const app = new Koa();
app.use(bodyparser());

const appRouter = new Router();

app.use(authRouter.routes());
/*
app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.get('X-Response-Time');
  logger.info(`${ctx.method} ${ctx.url} - ${rt}`);
});
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
  logger.info(ms);
});
// */
// verify authentication middleware

appRouter.use(authRouter.middleware());
appRouter.get('/verify', (ctx) => {
  logger.info('verify hit, after middleware');
  ctx.status = 201;
});
appRouter.use('/user', userRouter.routes());
app.use(appRouter.routes());

app.listen(config.port, () => logger.info('Server Ready!'));
