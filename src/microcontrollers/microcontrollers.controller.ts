import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  Logger,
} from '@nestjs/common';
import { MicrocontrollersService } from './microcontrollers.service';
import { CreateMicrocontrollerDto } from './dto/create-controller.dto';
import { UpdateMicrocontrollerDto } from './dto/update-controller.dto';

@Controller('controllers')
export class MicrocontrollersController {
  private readonly logger = new Logger(MicrocontrollersController.name);

  constructor(private readonly service: MicrocontrollersService) {}

  @Post()
  create(@Body() dto: CreateMicrocontrollerDto) {
    this.logger.log(
      `Creating microcontroller SN=${dto.serialNumber}, location=${dto.location}`,
    );
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    this.logger.debug('Client requested list of all microcontrollers');
    return this.service.findAll();
  }

  @Get(':serial')
  findOne(@Param('serial') serial: string) {
    this.logger.debug(`Client requested microcontroller SN=${serial}`);
    return this.service.findOneBySerialNumber(serial);
  }

  @Patch(':serial')
  update(@Param('serial') sn: string, @Body() dto: UpdateMicrocontrollerDto) {
    this.logger.log(
      `Updating microcontroller SN=${sn}, fields=${Object.keys(dto).join(', ')}`,
    );
    return this.service.updateBySerialNumber(sn, dto);
  }

  @Delete(':serial')
  deleteOne(@Param('serial') serial: string) {
    this.logger.log(`Deleting microcontroller SN=${serial}`);
    return this.service.removeBySerialNumber(serial);
  }
}
