import { Injectable } from '@nestjs/common';
import { PusherService } from 'nestjs-pusher';

@Injectable()
export class PaintService {
  constructor(private readonly pusherService: PusherService) {}
  async create(body: unknown) {
    console.log('Pushing data to pusher', body);
    await this.pusherService.trigger('painting', 'draw', body);
    return body;
  }
}
