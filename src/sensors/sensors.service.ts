import {
  Injectable,
  NotFoundException,
  Logger,
  Controller,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sensor } from './entities/sensor.entity';
import { Microcontroller } from 'src/microcontrollers/entities/microcontrollers.entity';
import { RegisterSensorDto } from './dto/register-sensor.dto';
import { UpdateSensorDto } from './dto/update-sensor.dto';
import { SensorParameter } from 'src/sensor-parameters/entities/sensor-parameter.entity';

@Injectable()
export class SensorsService {
  private readonly logger = new Logger(SensorsService.name);

  constructor(
    @InjectRepository(Sensor)
    private readonly repo: Repository<Sensor>,
    @InjectRepository(SensorParameter)
    private readonly paramRepo: Repository<SensorParameter>,
  ) {}

  async register(controller: Microcontroller, dtos: RegisterSensorDto[]) {
    if (!controller) {
      throw new NotFoundException(`Controller is missing`);
    }

    const sensors: Sensor[] = [];

    for (const dto of dtos) {
      const sensor = this.repo.create({
        localId: dto.localId,
        pin: dto.pin,
        //unit: dto.unit,
        isEnabled: dto.isEnabled,
        // parameter: param, // додаси пізніше
        controller,
      });

      sensors.push(sensor);
    }

    const saved = await this.repo.save(sensors);
    this.logger.log(
      `Registered ${saved.length} sensors for controller SN=${controller.serialNumber}`,
    );
    return saved;
  }

  // async registerForController(
  //   serialNumber: string,
  //   dtos: RegisterSensorDto[],
  //   controller: Microcontroller,
  // ): Promise<Sensor[]> {
  //   const sensors: Sensor[] = [];

  //   for (const dto of dtos) {
  //     const existing = await this.sensorRepo.findOne({
  //       where: {
  //         localId: dto.localId,
  //         controller: { id: controller.id },
  //       },
  //     });

  //     if (existing) {
  //       this.logger.log(
  //         `Sensor localId=${dto.localId} already registered for controller=${serialNumber}`,
  //       );
  //       sensors.push(existing);
  //       continue;
  //     }

  //     const sensor = this.sensorRepo.create({ ...dto, controller });
  //     const saved = await this.sensorRepo.save(sensor);
  //     this.logger.log(
  //       `Registered new sensor localId=${dto.localId} on controller=${serialNumber}`,
  //     );
  //     sensors.push(saved);
  //   }
  //   return this.sensorRepo.save(sensors);
  // }

  async findAllByControllerID(controllerId: number): Promise<Sensor[]> {
    const res = await this.repo.find({
      where: {
        controller: { id: controllerId },
      },
      relations: ['parameter', 'controller'],
    });
    this.logger.debug(
      `Found ${res.length} sensors with controller id=${controllerId}`,
    );
    return res;
  }

  async findOne(id: number): Promise<Sensor> {
    const entity = await this.repo.findOneBy({ id });
    if (!entity) {
      this.logger.warn(`Sensor id=${id} not found`);
      throw new NotFoundException(`Sensor with id=${id} not found`);
    }
    this.logger.debug(`Fetched Sensor id=${id}`);
    return entity;
  }

  async findByLocalIdAndControllerId(
    localId: string,
    controllerId: number,
  ): Promise<Sensor> {
    const entity = await this.repo.findOne({
      where: {
        localId,
        controller: { id: controllerId },
      },
      relations: ['parameter', 'controller'],
    });

    if (!entity) {
      this.logger.warn(
        `Sensor localId=${localId} (controllerId=${controllerId}) not found`,
      );
      throw new NotFoundException(
        `Sensor with localId='${localId}' and controllerId='${controllerId}' not found`,
      );
    }

    this.logger.debug(
      `Fetched Sensor localId=${localId}, controllerId=${controllerId}`,
    );
    return entity;
  }

  async updateByLocalIdAndControllerId(
    localId: string,
    controllerId: number,
    dto: UpdateSensorDto,
  ): Promise<Sensor> {
    const sensor = await this.findByLocalIdAndControllerId(
      localId,
      controllerId,
    );

    // 🧠 Працюємо з parameterId
    if ('parameterId' in dto) {
      if (dto.parameterId === null) {
        sensor.parameter = null;
      } else {
        const parameter = await this.paramRepo.findOneBy({
          id: dto.parameterId,
        });
        if (!parameter) {
          throw new NotFoundException(
            `SensorParameter with id=${dto.parameterId} not found`,
          );
        }
        sensor.parameter = parameter;
      }
    }

    // Інші поля
    if (typeof dto.delayMS === 'number') {
      sensor.delayMS = dto.delayMS;
    }
    if (typeof dto.isEnabled === 'boolean') {
      sensor.isEnabled = dto.isEnabled;
    }

    const updated = await this.repo.save(sensor);
    this.logger.log(
      `Updated sensor ${localId} for controllerId=${controllerId}`,
    );
    return updated;
  }
}
