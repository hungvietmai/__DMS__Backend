import type { INestApplication } from '@nestjs/common';
import compression from 'compression';
import session from 'express-session';
import helmet from 'helmet';
import passport from 'passport';
import { RedisStore } from 'connect-redis';
import Redis from 'ioredis';

export function middleware(app: INestApplication): INestApplication {
  const isProduction = process.env['NODE_ENV'] === 'production';

  // Redis client
  const redisClient = new Redis({
    host: process.env['REDIS_HOST'] || 'localhost',
    port: parseInt(process.env['REDIS_PORT'] || '6379', 10),
    password: process.env['REDIS_PASSWORD'] || undefined,
  });

  app.use(compression());

  app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      secret: process.env['SESSION_SECRET'] || 'dev-secret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: isProduction,
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        sameSite: isProduction ? 'lax' : 'strict',
      },
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.use(
    helmet(
      isProduction
        ? {} // Enable all protections in prod
        : {
          contentSecurityPolicy: false,
          crossOriginEmbedderPolicy: false,
        },
    ),
  );

  app.enableCors({
    origin: process.env['FRONTEND_URL']?.split(',') || '*',
    credentials: true,
  });

  return app;
}
