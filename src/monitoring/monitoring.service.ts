import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Checkpoint } from 'src/checkpoints/entities/checkpoint.entity';
import { SensorLogService } from 'src/logs/sensor-log.service';
import { Microcontroller } from 'src/microcontrollers/entities/microcontrollers.entity';
import { Repository } from 'typeorm';

export type MonitoringCheckpoint = {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  readings: {
    localId: string;
    parameter: string | null;
    value: number;
    unit?: string;
    timestamp: Date;
  }[];
};

@Injectable()
export class MonitoringService {
  constructor(
    @InjectRepository(Microcontroller)
    private readonly controllerRepo: Repository<Microcontroller>,
    @InjectRepository(Checkpoint)
    private readonly checkpointRepo: Repository<Checkpoint>,
    private readonly sensorLogService: SensorLogService,
  ) {}

  private readonly logger = new Logger(MonitoringService.name);

  async getLatestReadingsForCheckpoint(checkpointId: number) {
    const checkpoint = await this.checkpointRepo.findOneBy({
      id: checkpointId,
    });

    if (!checkpoint) {
      throw new NotFoundException(
        `Checkpoint with id=${checkpointId} not found`,
      );
    }

    const controllers = await this.controllerRepo.find({
      where: { checkpoint: { id: checkpointId } },
      relations: ['sensors', 'sensors.parameter'],
    });

    this.logger.debug(
      `Found [${controllers.length}] controllers for monitoring`,
    );

    const allSensors = controllers.flatMap((c) => c.sensors);

    const readings = await Promise.all(
      allSensors.map(async (sensor) => {
        const latest = await this.sensorLogService.findLatest(sensor.localId);
        if (!latest) return null;

        return {
          localId: sensor.localId,
          parameter: sensor.parameter?.name ?? null,
          value: latest.value,
          unit: latest.unit,
          timestamp: latest.timestamp,
        };
      }),
    );

    this.logger.debug(`Mapped [${readings.length}] readings for monitoring`);

    return {
      id: checkpoint.id,
      name: checkpoint.name,
      latitude: checkpoint.latitude,
      longitude: checkpoint.longitude,
      readings: readings.filter((r) => r !== null),
    };
  }

  async getAllLatestReadings(): Promise<MonitoringCheckpoint[]> {
    const checkpoints = await this.checkpointRepo.find({
      where: { isActive: true },
    });

    this.logger.debug(
      `Found ${checkpoints.length} suitable checkpoints for monitoring`,
    );

    const result: MonitoringCheckpoint[] = [];

    for (const cp of checkpoints) {
      const controllers = await this.controllerRepo.find({
        where: { checkpoint: { id: cp.id } },
        relations: ['sensors', 'sensors.parameter'],
      });

      this.logger.debug(
        `Found ${controllers.length} controllers for monitoring`,
      );

      const allSensors = controllers.flatMap((c) => c.sensors);

      this.logger.debug(`Found ${allSensors.length} sensors for monitoring`);

      const readings = await Promise.all(
        allSensors.map(async (sensor) => {
          const latest = await this.sensorLogService.findLatest(sensor.localId);
          if (!latest) return null;

          return {
            localId: sensor.localId,
            parameter: sensor.parameter?.name ?? null,
            value: latest.value,
            unit: latest.unit,
            timestamp: latest.timestamp,
          };
        }),
      );

      this.logger.debug(`Found ${readings.length} readings for monitoring`);

      result.push({
        id: cp.id,
        name: cp.name,
        latitude: cp.latitude,
        longitude: cp.longitude,
        readings: readings.filter((r) => r !== null),
      });
    }

    return result;
  }
}
