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
import { RegisterMicrocontrollerDto } from './dto/register-controller.dto';
import { AdminUpdateMicrocontrollerDto } from './dto/admin-update-controller.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { ControllerStatus } from './entities/microcontrollers.entity';
import { AlertsService } from 'src/alerts/alerts.service';
import { ConfigurationService } from 'src/configuration/configuration.service';

@Controller('controllers')
export class MicrocontrollersController {
  private readonly logger = new Logger(MicrocontrollersController.name);

  constructor(
    private readonly service: MicrocontrollersService,
    private readonly alertService: AlertsService,
    private readonly configService: ConfigurationService,
  ) {}

  @Get('/statuses')
  getStatuses() {
    this.logger.log('Sending statuses');
    return ControllerStatus;
  }

  @Post('')
  async register(@Body() dto: RegisterMicrocontrollerDto) {
    this.logger.log(`Incoming registration from SN=${dto.serialNumber}`);
    const res = await this.service.registerOrUpdate(dto);
    await this.alertService.create({
      message: 'Register controller request',
      level: 'INFO',
      relatedData: dto,
    });
    return res;
  }

  @Patch(':serial/status')
  updateStatus(@Param('serial') sn: string, @Body() dto: UpdateStatusDto) {
    this.logger.log(`Updated status for SN=${sn} to ${dto.status}`);
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
  update(
    @Param('serial') sn: string,
    @Body() dto: AdminUpdateMicrocontrollerDto,
  ) {
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
