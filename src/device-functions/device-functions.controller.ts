import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DeviceFunctionsService } from './device-functions.service';
import { CreateDeviceFunctionDto } from './dto/create-device-function.dto';
import { UpdateDeviceFunctionDto } from './dto/update-device-function.dto';

@Controller('device-functions')
export class DeviceFunctionsController {
  constructor(
    private readonly deviceFunctionsService: DeviceFunctionsService,
  ) {}

  @Post()
  create(@Body() createDeviceFunctionDto: CreateDeviceFunctionDto) {
    return this.deviceFunctionsService.create(createDeviceFunctionDto);
  }

  @Get()
  findAll() {
    return this.deviceFunctionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.deviceFunctionsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDeviceFunctionDto: UpdateDeviceFunctionDto,
  ) {
    return this.deviceFunctionsService.update(+id, updateDeviceFunctionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deviceFunctionsService.remove(+id);
  }
}
