import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
} from '@nestjs/common';
import { SensorParametersService } from './sensor-parameters.service';
import { CreateSensorParameterDto } from './dto/create-sensor-parameter.dto';
import { UpdateSensorParameterDto } from './dto/update-sensor-parameter.dto';

@Controller('sensor-parameters')
export class SensorParametersController {
  private readonly logger = new Logger(SensorParametersController.name);

  constructor(
    private readonly sensorParametersService: SensorParametersService,
  ) {}

  @Post()
  async create(@Body() dto: CreateSensorParameterDto) {
    this.logger.log(`Creating sensor parameter: ${dto.name}`);
    return this.sensorParametersService.create(dto);
  }

  @Get()
  async findAll() {
    this.logger.debug('Fetching all sensor parameters');
    return this.sensorParametersService.findAll();
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateSensorParameterDto) {
    this.logger.log(`Updating sensor parameter id=${id}`);
    return this.sensorParametersService.update(+id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    this.logger.warn(`Deleting sensor parameter id=${id}`);
    return this.sensorParametersService.remove(+id);
  }
}
