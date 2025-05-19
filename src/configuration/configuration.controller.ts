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
import { ConfigurationService } from './configuration.service';
import { CreateConfigurationDto } from './dto/create-configuration.dto';
import { UpdateConfigurationDto } from './dto/update-configuration.dto';

@Controller('configurations')
export class ConfigurationController {
  private readonly logger = new Logger(ConfigurationController.name);

  constructor(private readonly configurationService: ConfigurationService) {}

  @Post()
  async create(@Body() createConfigurationDto: CreateConfigurationDto) {
    this.logger.log(`Creating configuration: ${createConfigurationDto.name}`);
    return this.configurationService.create(createConfigurationDto);
  }

  @Get()
  async findAll() {
    this.logger.debug('Fetching all configurations');
    return this.configurationService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    this.logger.log(`Fetch configuration id=${id}`);
    return this.configurationService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateConfigurationDto: UpdateConfigurationDto,
  ) {
    this.logger.log(`Updating configuration id=${id}`);
    return this.configurationService.update(+id, updateConfigurationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.logger.warn(`Deleting configuration id=${id}`);
    return this.configurationService.remove(+id);
  }
}
