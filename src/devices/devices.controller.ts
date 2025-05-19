import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Logger,
} from '@nestjs/common';
import { DevicesService } from './devices.service';
import { RegisterDeviceDto } from './dto/register-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { MicrocontrollersService } from 'src/microcontrollers/microcontrollers.service';

@Controller('devices')
export class DevicesController {
  private readonly logger = new Logger(DevicesController.name);
  constructor(
    private readonly devicesService: DevicesService,
    private readonly controllersService: MicrocontrollersService,
  ) {}

  @Post('/controllers/:serial/devices')
  async registerSensors(
    @Param('serial') serial: string,
    @Body() dtos: RegisterDeviceDto[],
  ) {
    this.logger.log(`Device registration from controller SN=${serial}`);
    const controller =
      await this.controllersService.findOneBySerialNumberOrFail(serial);
    return this.devicesService.register(controller, dtos);
  }

  @Get('/controllers/:serial/devices')
  async getSensorsForController(@Param('serial') serial: string) {
    this.logger.debug(`Fetching devices for controller sn=${serial}`);
    const controller =
      await this.controllersService.findOneBySerialNumberOrFail(serial);
    return this.devicesService.findAllByControllerID(controller.id);
  }

  @Get('/controllers/:serial/sensors/:localId')
  async findOne(
    @Param('serial') serial: string,
    @Param('localId') localId: string,
  ) {
    this.logger.debug(`Fetching sensor ${localId} for controller sn=${serial}`);
    const controller =
      await this.controllersService.findOneBySerialNumberOrFail(serial);
    return this.devicesService.findByLocalIdAndControllerId(
      localId,
      controller.id,
    );
  }

  @Patch('/controllers/:serial/sensors/:localId')
  async updateSensor(
    @Param('serial') serial: string,
    @Param('localId') localId: string,
    @Body() updateDto: UpdateDeviceDto,
  ) {
    this.logger.log(`Updating sensor ${localId} for controller sn=${serial}`);
    const controller =
      await this.controllersService.findOneBySerialNumberOrFail(serial);

    return this.devicesService.updateByLocalIdAndControllerId(
      localId,
      controller.id,
      updateDto,
    );
  }
}
