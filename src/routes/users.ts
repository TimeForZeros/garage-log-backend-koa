import Router from 'koa-router';

const userRouter = new Router();

userRouter.get('/', (ctx) => {
  ctx.body = 'user list goes here';
});

export default userRouter;
