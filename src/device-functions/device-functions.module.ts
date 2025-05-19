import { Module } from '@nestjs/common';
import { DeviceFunctionsService } from './device-functions.service';
import { DeviceFunctionsController } from './device-functions.controller';
import { DeviceFunction } from './entities/device-function.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([DeviceFunction])],
  controllers: [DeviceFunctionsController],
  providers: [DeviceFunctionsService],
})
export class DeviceFunctionsModule {}
