import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CheckpointsService } from './checkpoints.service';
import { CreateCheckpointDto } from './dto/create-checkpoint.dto';
import { UpdateCheckpointDto } from './dto/update-checkpoint.dto';

@Controller('checkpoints')
export class CheckpointsController {
  private readonly logger = new Logger(CheckpointsController.name);

  constructor(private readonly service: CheckpointsService) {}

  @Post()
  create(@Body() dto: CreateCheckpointDto) {
    this.logger.log(`Creating checkpoint ${dto.name}`);
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    this.logger.debug('Fetching all checkpoints');
    return this.service.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    this.logger.log(`Fetch checkpoint id=${id}`);
    return this.service.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCheckpointDto) {
    this.logger.log(`Updating checkpoint id=${id}`);
    return this.service.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.logger.warn(`Deleting checkpoint id=${id}`);
    return this.service.remove(+id);
  }
}
