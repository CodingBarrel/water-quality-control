import { Controller, Get, Logger, Param } from '@nestjs/common';
import { MonitoringService } from './monitoring.service';

@Controller('monitoring')
export class MonitoringController {
  constructor(private readonly monitoringService: MonitoringService) {}

  private readonly logger = new Logger(MonitoringController.name);

  @Get('all-latest')
  getAllLatest() {
    this.logger.debug('Fetching all sensor readings');
    return this.monitoringService.getAllLatestReadings();
  }

  @Get('/:id/latest-readings')
  getCheckpointData(@Param('id') id: number) {
    this.logger.debug(`Fetching all sensor readings for checkpoint=${id}`);
    return this.monitoringService.getLatestReadingsForCheckpoint(id);
  }
}
