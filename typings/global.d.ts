import type { User } from '../src/shared/user/index.ts';

export declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: string;
      PORT: string;

      MONGO_URI: string;
      JWT_SECRET: string;
      JWT_REFRESH_SECRET: string;
    }
  }
}

declare module 'http' {
  interface IncomingMessage {
    // customProps of pino-http
    customProps: object;
    // Request.prototype of fastify
    originalUrl: string;
  }
}

declare module 'fastify' {
  interface FastifyRequest {
    user?: User;
  }
}
