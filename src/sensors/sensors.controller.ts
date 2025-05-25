import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Logger,
} from '@nestjs/common';
import { SensorsService } from './sensors.service';
import { RegisterSensorDto } from './dto/register-sensor.dto';
import { UpdateSensorDto } from './dto/update-sensor.dto';
import { MicrocontrollersService } from 'src/microcontrollers/microcontrollers.service';

@Controller()
export class SensorsController {
  private readonly logger = new Logger(SensorsController.name);
  constructor(
    private readonly sensorsService: SensorsService,
    private readonly controllersService: MicrocontrollersService,
  ) {}

  @Post('/controllers/:serial/sensors')
  async registerSensors(
    @Param('serial') serial: string,
    @Body() dtos: RegisterSensorDto[],
  ) {
    this.logger.log(`Sensor registration from controller SN=${serial}`);
    const controller =
      await this.controllersService.findOneBySerialNumberOrFail(serial);
    return this.sensorsService.register(controller, dtos);
  }

  @Get('/controllers/:serial/sensors')
  async getSensorsForController(@Param('serial') serial: string) {
    this.logger.debug(`Fetching sensors for controller sn=${serial}`);
    const controller =
      await this.controllersService.findOneBySerialNumberOrFail(serial);
    return this.sensorsService.findAllByControllerID(controller.id);
  }

  @Get('/controllers/:serial/sensors/:localId')
  async findOne(
    @Param('serial') serial: string,
    @Param('localId') localId: string,
  ) {
    this.logger.debug(
      `Fetching sensor id=${localId} for controller sn=${serial}`,
    );
    const controller =
      await this.controllersService.findOneBySerialNumberOrFail(serial);
    return this.sensorsService.findByLocalIdAndControllerId(
      localId,
      controller.id,
    );
  }

  @Patch('/controllers/:serial/sensors/:localId')
  async updateSensor(
    @Param('serial') serial: string,
    @Param('localId') localId: string,
    @Body() updateDto: UpdateSensorDto,
  ) {
    this.logger.log(`Updating sensor ${localId} for controller sn=${serial}`);
    const controller =
      await this.controllersService.findOneBySerialNumberOrFail(serial);

    return this.sensorsService.updateByLocalIdAndControllerId(
      localId,
      controller.id,
      updateDto,
    );
  }
}
