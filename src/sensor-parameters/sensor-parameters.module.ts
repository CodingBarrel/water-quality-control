import { Module } from '@nestjs/common';
import { SensorParametersService } from './sensor-parameters.service';
import { SensorParametersController } from './sensor-parameters.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SensorParameter } from './entities/sensor-parameter.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SensorParameter])],
  controllers: [SensorParametersController],
  providers: [SensorParametersService],
})
export class SensorParametersModule {}
