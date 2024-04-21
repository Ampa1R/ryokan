import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseQueryLogger } from './query.logger';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        ...configService.get('db'),
        logger: new DatabaseQueryLogger(),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [],
})
export class DatabaseModule { }
