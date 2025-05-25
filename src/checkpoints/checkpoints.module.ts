import { Module } from '@nestjs/common';
import { CheckpointsController } from './checkpoints.controller';
import { CheckpointsService } from './checkpoints.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Checkpoint } from './entities/checkpoint.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Checkpoint])],
  controllers: [CheckpointsController],
  providers: [CheckpointsService],
  exports: [CheckpointsService],
})
export class CheckpointsModule {}
