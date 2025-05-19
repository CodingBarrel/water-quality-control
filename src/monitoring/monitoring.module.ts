import { Module } from '@nestjs/common';
import { MonitoringService } from './monitoring.service';
import { MonitoringController } from './monitoring.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SensorLogsModule } from 'src/logs/sensor-logs.module';
import { Microcontroller } from 'src/microcontrollers/entities/microcontrollers.entity';
import { Checkpoint } from 'src/checkpoints/entities/checkpoint.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Checkpoint, Microcontroller]),
    SensorLogsModule,
  ],
  controllers: [MonitoringController],
  providers: [MonitoringService],
})
export class MonitoringModule {}
