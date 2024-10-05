import { IsBoolean, IsString, ValidateNested } from 'class-validator';
import { Config } from './base';
import { NestJsPusherOptions } from 'nestjs-pusher/dist/pusher.module';

export class PusherConfigOptions {
  @IsString()
  appId: string;

  @IsString()
  key: string;

  @IsString()
  secret: string;

  @IsString()
  cluster: string;

  @IsBoolean()
  useTLS: boolean;
}

export class PusherConfig {
  @ValidateNested()
  options: PusherConfigOptions;
}

const factory = (): NestJsPusherOptions => ({
  options: {
    appId: process.env.PUSHER_APP_ID!,
    key: process.env.PUSHER_KEY!,
    secret: process.env.PUSHER_SECRET!,
    cluster: process.env.PUSHER_CLUSTER || 'eu',
    useTLS: Boolean(process.env.PUSHER_USE_TLS) || true,
  },
});

export default {
  name: 'pusher',
  factory,
  schema: PusherConfig,
} satisfies Config;
