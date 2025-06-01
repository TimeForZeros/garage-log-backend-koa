import Koa from 'koa';
import Router from 'koa-router';
import session from 'koa-session';
import authRouter from './routes/auth';
import userRouter from './routes/users';
import 'dotenv/config';


const app = new Koa();
const appRouter = new Router();

app.keys = [process.env.SESSION_KEY as string];

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

app.listen(3000);
