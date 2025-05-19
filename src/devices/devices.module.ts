import { Module } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { DevicesController } from './devices.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Device } from './entities/device.entity';
import { MicrocontrollersModule } from 'src/microcontrollers/microcontrollers.module';

@Module({
  imports: [TypeOrmModule.forFeature([Device]), MicrocontrollersModule],
  controllers: [DevicesController],
  providers: [DevicesService],
})
export class DevicesModule {}
