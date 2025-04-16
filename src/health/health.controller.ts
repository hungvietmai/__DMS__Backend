import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, MongooseHealthIndicator, type HealthCheckResult } from '@nestjs/terminus';

@Controller()
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: MongooseHealthIndicator,
  ) {}

  @Get('health')
  @HealthCheck()
  public async check(): Promise<HealthCheckResult> {
    return this.health.check([async () => this.db.pingCheck('mongodb')]);
  }
}
