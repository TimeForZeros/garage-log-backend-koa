import Router from 'koa-router';
import { createUser } from '@/controllers/users.js';
import jwt from 'jsonwebtoken';
import config from '@/config.js';
import { verify } from '@/controllers/auth.js';
import logger from '@/util/index.js';

const authRouter = new Router();

authRouter.post('/logout', () => {});

authRouter.post('/login', (ctx) => {
  const loginData = ctx.request.body!;
  if (!loginData) ctx.response.status = 400;
  const token = jwt.sign(loginData, config.secret, { algorithm: 'HS256', expiresIn: 60 });
  ctx.cookies.set('garage-log-token', token, { sameSite: true, maxAge: 60 * 1000 });
  ctx.status = 200;
});

authRouter.post('/signup', async (ctx) => {
  const res = await createUser(ctx.request.body);
  ctx.status = res.status;
  if (!res.body) return;
  ctx.status = 201;
});

authRouter.use(async (ctx, next) => {
  logger.info('auth middleware hit');
  try {
    const token = ctx.cookies.get('garage-log-token');
    if (token) {
      const payload = verify(token); // do something with this
      logger.log('silly', payload);
      return await next();
    }
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      logger.info(err.message);
    } else {
      logger.error(err);
      ctx.status = 500;
      return;
    }
  }
  ctx.status = 401;
});

export default authRouter;
