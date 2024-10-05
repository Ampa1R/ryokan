import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PusherModule } from 'nestjs-pusher';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import config from '../config';
import { UsersModule } from '../domains/users/users.module';
import { DatabaseModule } from '../database/database.module';
import { HealthController } from './health.controller';
import { PusherConfig } from '../config/pusher.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: config.load,
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    PusherModule.forRootAsync({
      useFactory: (configService: ConfigService) =>
        configService.get<PusherConfig>('pusher')!,
      inject: [ConfigService],
    }),
    UsersModule,
  ],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
