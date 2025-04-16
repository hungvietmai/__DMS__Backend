import { type CanActivate, type ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { FastifyRequest } from 'fastify';

@Injectable()
export class LocalLoginGuard extends AuthGuard('local') implements CanActivate {
  public override async canActivate(context: ExecutionContext): Promise<boolean> {
    // Call the super method for authentication
    const result = <boolean>await super.canActivate(context);

    // Get the Fastify request object
    const request = context.switchToHttp().getRequest<FastifyRequest>();
    // Log the user in using the passport strategy's login method;
    // note that in Fastify you should ensure that the login method is correctly attached via your Fastify passport configuration.
    await super.logIn(request);

    return result;
  }
}
