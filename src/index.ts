import Koa from 'koa';
import Router from 'koa-router';
import bodyparser from 'koa-bodyparser';
import authRouter from '@/routes/auth.js';
import userRouter from '@/routes/users.js';
import pgConnect from '@/db.js';
import '@/db/index.js';
import logger from '@/util/index.js';
import config from '@config';

console.log(config);

await pgConnect();

const app = new Koa();
app.use(bodyparser());

const appRouter = new Router();

app.use(authRouter.routes());
app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.get('X-Response-Time');
  console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
  console.log(ms);
});
// verify authentication middleware

appRouter.use('/user', userRouter.routes());
app.use(appRouter.routes());

app.listen(3000, () => {
  logger.log('info', 'Server Started!!');
});
