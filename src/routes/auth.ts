import Router from 'koa-router';
import { createUser } from '@/controllers/users.js';
import jwt from 'jsonwebtoken';
import { createHMAC, createSHA3, IDataType } from 'hash-wasm';
import config from '@/config.js';

const authRouter = new Router();

authRouter.post('/logout', () => {});
authRouter.post('/login', async (ctx) => {
  const hashFunc = createSHA3(256);
  const loginData = ctx.request.body as IDataType;
  const hmac = await createHMAC(hashFunc, config.secret);
  hmac.init();
  hmac.update('test');
  const hmacData = hmac.digest();
  const token = jwt.sign(loginData, hmacData, { algorithm: 'HS256', expiresIn: '1h' });
  console.log(token);

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
