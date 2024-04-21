import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

import { IsBoolean, IsNumber, IsString, Max, Min } from 'class-validator';
import { Config } from "./base";


export class DBConfig {
  @IsNumber()
  @Min(0)
  @Max(65535)
  port: number;

  @IsString()
  host: string;

  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsString()
  database: string;

  @IsBoolean()
  synchronize: boolean;

  @IsBoolean()
  logging: boolean;
}

const factory = (): PostgresConnectionOptions => ({
  port: parseInt(process.env.DB_PORT, 10),
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: Boolean(process.env.DB_SYNCHRONIZE) || false,
  logging: Boolean(process.env.DB_LOGGING) || true,
  migrationsRun: false,
  namingStrategy: new SnakeNamingStrategy(),
  entities: ['dist/**/*.entity{.js,.ts}'],
  migrations: ['dist/database/migrations/*{.js,.ts}'],
  type: 'postgres',
});


export default {
  name: 'db',
  factory,
  schema: DBConfig,
} satisfies Config;
