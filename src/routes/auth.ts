import Router from 'koa-router';

const authRouter = new Router();

authRouter.post('/login', (ctx) => {
  console.dir(ctx);
  ctx.body = 'Affirmative';
});
authRouter.post('/logout', (ctx) => {});
authRouter.post('/signup', (ctx) => {});

export default authRouter;
