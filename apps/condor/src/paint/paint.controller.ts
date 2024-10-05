import { Body, Controller, Post } from '@nestjs/common';
import { PaintService } from './paint.service';

@Controller('paint')
export class PaintController {
  constructor(private readonly paintService: PaintService) {}

  @Post()
  async create(@Body() body: unknown) {
    return this.paintService.create(body);
  }
}
