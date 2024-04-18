import { IsNumber, IsString, Max, Min } from 'class-validator';

import { Config } from "./base";

export class DBConfig {
  @IsNumber()
  @Min(0)
  @Max(65535)
  port: number;

  @IsString()
  host: string;

  @IsString()
  user: string;

  @IsString()
  pass: string;
}

const factory = () => ({
  port: parseInt(process.env.DB_PORT, 10),
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  pass: process.env.DB_PASS,
});


export default {
  name: 'db',
  factory,
  schema: DBConfig,
} satisfies Config;
