import { IsEnum, IsNumber, Max, Min } from 'class-validator';

import { Config } from "./base";

export enum AppEnv {
  Development = 'development',
  Staging = 'staging',
  Production = 'production',
  Test = 'test',
}

export class AppConfig {
  @IsNumber()
  @Min(0)
  @Max(65535)
  port: number;

  @IsEnum(AppEnv)
  env: AppEnv;
}

const factory = () => ({
  port: parseInt(process.env.APP_PORT, 10) || 4000,
  env: process.env.NODE_ENV || 'production',
});


export default {
  name: 'app',
  factory,
  schema: AppConfig,
} satisfies Config;
