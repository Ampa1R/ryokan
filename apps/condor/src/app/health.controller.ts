// nestjs controller with health check postgresql
import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { Client } from 'pg';

@Controller('health')
export class HealthController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  async getData() {
    const client = new Client({
      host: this.configService.get('db.host'),
      port: this.configService.get('db.port'),
      user: this.configService.get('db.username'),
      password: this.configService.get('db.password'),
      database: this.configService.get('db.database'),
    });
    try {
      await client.connect();
      return { status: 'ok' };
    } catch {
      return { status: 'error' };
    } finally {
      client.end();
    }
  }
}
