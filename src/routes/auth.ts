import Router from 'koa-router';
import { createUser } from '../controllers/users.js';

const authRouter = new Router();

authRouter.post('/logout', () => {});
authRouter.post('/login', (ctx) => {
  const loginData = ctx.request.body;
  ctx.body = 'Affirmative';
});
authRouter.post('/signup', async (ctx) => {
  const res = await createUser(ctx.request.body);
  console.log(res.status);
  ctx.response.status = res.status;
  if (!res.body) return;
  ctx.response.body = res.body;
});

export default authRouter;
