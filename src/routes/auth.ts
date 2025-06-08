import Router from 'koa-router';
import { createUser, getUser, LoginSchema, SignupSchema } from '@/controllers/users.js';
import jwt from 'jsonwebtoken';
import config from '@/config.js';
import { verify, authenticate } from '@/controllers/auth.js';
import logger from '@/util/index.js';

const authRouter = new Router();

authRouter.post('/logout', () => {});

authRouter.post('/login', async (ctx) => {
  try {
    ctx.status = 200;
    const loginData = LoginSchema.parse(ctx.request.body);
    const user = await getUser(loginData.email);
    if (!user) {
      ctx.status = 400;
      ctx.body = 'No user found';
      return;
    }
    const isAuthenticated = await authenticate(loginData.password, user.password);
    if (isAuthenticated) {
      const token = jwt.sign(user, config.secret, { algorithm: 'HS256', expiresIn: 600 });
      ctx.cookies.set('garage-log-token', token, { httpOnly: true, sameSite: true, maxAge: 600 * 1000 });
      // ctx.body = token;
      ctx.status = 200;
      return;
    }
  } catch (err) {
    console.error(err);
    ctx.status = 400;
    return;
  }
});

authRouter.post('/signup', async (ctx) => {
  const signupData = SignupSchema.parse(ctx.request.body);
  try {
    const issues = await createUser(signupData);
    if (!issues) {
      ctx.status = 201;
      return;
    }
    ctx.status = 400;
    ctx.body = issues;
  } catch (err) {
    logger.error(err);
    ctx.status = 500;
  }
});

authRouter.use(async (ctx, next) => {
  logger.debug('auth middleware hit');
  try {
    const token = ctx.cookies.get('garage-log-token');
    if (token) {
      try {
        verify(token); // do something with this
        return next();
      } catch (err) {
        ctx.cookies.set('garage-log-token', '');
      }
    }
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      logger.debug('error', err.message);
    } else {
      logger.error(err);
      ctx.status = 500;
      return;
    }
  }
  ctx.status = 401;
});

export default authRouter;
