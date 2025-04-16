import { ArgumentsHost, Catch, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class ExceptionsFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(ExceptionsFilter.name);

  public override catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const args = {
      method: request.method,
      url: request.url,
      body: request.body,
    };

    const status = this.getHttpStatus(exception);

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      if (exception instanceof Error) {
        this.logger.error('Unhandled Exception', exception.stack, args);
      } else {
        this.logger.error('Unknown error object', JSON.stringify(exception), args);
      }
    }

    super.catch(exception, host);
  }

  private getHttpStatus(exception: unknown): HttpStatus {
    return exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
  }
}
