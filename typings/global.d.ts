import type { Payload } from '../src/auth';

export declare global {
    type AnyObject = Record<string, unknown>;

    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: string;
            PORT: string;

            MONGO_URI: string;

            JWT_SECRET: string;
            JWT_REFRESH_SECRET: string;
        }
    }

    namespace Express {
        interface Request {
            // customProps of pino-http
            customProps: object;
        }
        interface User extends Payload { }
    }
}