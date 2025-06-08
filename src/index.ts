import Koa from 'koa';
import Router from 'koa-router';
import bodyparser from 'koa-bodyparser';
import authRouter from '@/routes/auth.js';
import userRouter from '@/routes/users.js';
// import pgConnect from '@/db.js';
// import '@/db/index.js';
import logger from '@/util/index.js';
import config from '@config';
import cors from '@koa/cors';

logger.debug(`Environment: ${config.env}`);

const app = new Koa();
app.use(
  cors({
    credentials: true,
  }),
);

app.use(bodyparser());

const appRouter = new Router({ prefix: '/api' });
appRouter.use(authRouter.routes());
// verify authentication middleware
appRouter.use(authRouter.middleware());
appRouter.get('/verify', (ctx) => {
  ctx.status = 200;
  ctx.body = 'hits';
});
appRouter.use('/user', userRouter.routes());
app.use(appRouter.routes());

app.listen(config.port, () => logger.debug('Server Ready!'));
