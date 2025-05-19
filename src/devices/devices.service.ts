import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { RegisterDeviceDto } from './dto/register-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { Microcontroller } from 'src/microcontrollers/entities/microcontrollers.entity';
import { Device } from './entities/device.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DevicesService {
  private readonly logger = new Logger(DevicesService.name);

  constructor(
    @InjectRepository(Device)
    private readonly repo: Repository<Device>,
  ) {}
  async register(controller: Microcontroller, dtos: RegisterDeviceDto[]) {
    if (!controller) {
      throw new NotFoundException(`Controller is missing`);
    }

    const devices: Device[] = [];

    for (const dto of dtos) {
      const device = this.repo.create({
        localId: dto.localId,
        pin: dto.pin,
        controller,
        level: dto.level,
        isEnabled: dto.isEnabled,
      });

      devices.push(device);
    }

    const saved = await this.repo.save(devices);
    this.logger.log(
      `Registered ${saved.length} devices for controller SN=${controller.serialNumber}`,
    );
    return saved;
  }

  findAllByControllerID(controllerId: number): Promise<Device[]> {
    return this.repo.find({
      where: { controller: { id: controllerId } },
      relations: ['function'],
    });
  }

  async findOne(id: number): Promise<Device> {
    const entity = await this.repo.findOneBy({ id });
    if (!entity) {
      this.logger.warn(`Device id=${id} not found`);
      throw new NotFoundException(`Device with id=${id} not found`);
    }
    this.logger.debug(`Fetched Device id=${id}`);
    return entity;
  }

  async findByLocalIdAndControllerId(
    localId: string,
    controllerId: number,
  ): Promise<Device> {
    const entity = await this.repo.findOne({
      where: {
        localId,
        controller: { id: controllerId },
      },
      relations: ['function', 'controller'],
    });

    if (!entity) {
      this.logger.warn(
        `Device localId=${localId} (controllerId=${controllerId}) not found`,
      );
      throw new NotFoundException(
        `Device with localId='${localId}' and controllerId='${controllerId}' not found`,
      );
    }

    this.logger.debug(
      `Fetched Device localId=${localId}, controllerId=${controllerId}`,
    );
    return entity;
  }

  async updateByLocalIdAndControllerId(
    localId: string,
    controllerId: number,
    dto: UpdateDeviceDto,
  ): Promise<Device> {
    const sensor = await this.findByLocalIdAndControllerId(
      localId,
      controllerId,
    );

    Object.assign(sensor, dto);

    const updated = await this.repo.save(sensor);
    this.logger.log(
      `Updated device ${localId} for controllerId=${controllerId}`,
    );
    return updated;
  }
}
