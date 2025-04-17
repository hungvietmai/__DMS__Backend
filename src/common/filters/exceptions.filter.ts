import { type ArgumentsHost, Catch, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class ExceptionsFilter extends BaseExceptionFilter {
  private readonly logger: Logger = new Logger(ExceptionsFilter.name);

  public override catch(exception: unknown, host: ArgumentsHost): void {
    const req = host.switchToHttp().getRequest<Request>();
    const args = {
      method: req.method,
      url: req.url,
      body: req.body,
    };

    const status = this.getHttpStatus(exception);

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      if (exception instanceof Error) {
        this.logger.error('Internal server error', exception.stack, args);
      } else {
        this.logger.error('Unhandled exception', JSON.stringify(exception), args);
      }
    }

    super.catch(exception, host); // Pass control to default behavior (e.g., return response)
  }

  private getHttpStatus(exception: unknown): HttpStatus {
    return exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
  }
}
