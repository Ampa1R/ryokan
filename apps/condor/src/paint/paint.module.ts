import { Module } from '@nestjs/common';
import { PaintService } from './paint.service';
import { PaintController } from './paint.controller';

@Module({
  imports: [],
  controllers: [PaintController],
  providers: [PaintService],
  exports: [],
})
export class PaintModule {}
