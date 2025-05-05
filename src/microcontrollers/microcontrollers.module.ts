import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MicrocontrollersService } from './microcontrollers.service';
import { MicrocontrollersController } from './microcontrollers.controller';
import { Microcontroller } from './entities/microcontrollers.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Microcontroller])],
  providers: [MicrocontrollersService],
  controllers: [MicrocontrollersController],
})
export class MicrocontrollersModule {}
