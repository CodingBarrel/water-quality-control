import { Module } from '@nestjs/common';
import { SensorsService } from './sensors.service';
import { SensorsController } from './sensors.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sensor } from './entities/sensor.entity';
import { MicrocontrollersModule } from 'src/microcontrollers/microcontrollers.module';
import { SensorParameter } from 'src/sensor-parameters/entities/sensor-parameter.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sensor, SensorParameter]),
    MicrocontrollersModule,
  ],
  controllers: [SensorsController],
  providers: [SensorsService],
  exports: [SensorsService],
})
export class SensorsModule {}
