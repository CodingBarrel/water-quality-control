import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ControllerStatus,
  Microcontroller,
} from './entities/microcontrollers.entity';
import { Repository } from 'typeorm';
import { RegisterMicrocontrollerDto } from './dto/register-controller.dto';
import { AdminUpdateMicrocontrollerDto } from './dto/admin-update-controller.dto';
import { ConfigurationService } from 'src/configuration/configuration.service';
import { CheckpointsService } from 'src/checkpoints/checkpoints.service';

@Injectable()
export class MicrocontrollersService {
  private readonly logger = new Logger(MicrocontrollersService.name);

  constructor(
    @InjectRepository(Microcontroller)
    private controllerRepo: Repository<Microcontroller>,
    private configsService: ConfigurationService,
    private checkpointsService: CheckpointsService,
  ) {}

  async registerOrUpdate(dto: RegisterMicrocontrollerDto) {
    const controller = await this.controllerRepo.findOneBy({
      serialNumber: dto.serialNumber,
    });

    if (controller) {
      this.logger.log(
        `Controller ${dto.serialNumber} already exists. Updating info...`,
      );
      controller.firmwareVersion =
        dto.firmwareVersion ?? controller.firmwareVersion;
      controller.ip = dto.ip ?? controller.ip;
      controller.status = ControllerStatus.PENDING;
      controller.configuration = await this.configsService.findDefaultOne();
      const saved = this.controllerRepo.save(controller);
      return controller.configuration;
    }

    this.logger.log(`Registering new controller SN=${dto.serialNumber}`);
    const created = this.controllerRepo.create({
      serialNumber: dto.serialNumber,
      firmwareVersion: dto.firmwareVersion ?? '',
      ip: dto.ip ?? '',
    });
    return this.controllerRepo.save(created);
  }

  async findAll() {
    const result = await this.controllerRepo.find();
    this.logger.debug(`Fetched ${result.length} microcontrollers`);
    return result;
  }

  async findOneBySerialNumber(
    serialNumber: string,
  ): Promise<Microcontroller | null> {
    const controller = await this.controllerRepo.findOne({
      where: { serialNumber: serialNumber },
      relations: ['configuration'],
    });
    this.logger.debug(
      controller
        ? `Found microcontroller with SN=${serialNumber}`
        : `Microcontroller with SN=${serialNumber} not found`,
    );
    return controller;
  }

  async findOneBySerialNumberOrFail(
    serialNumber: string,
  ): Promise<Microcontroller> {
    try {
      const controller = await this.controllerRepo.findOneByOrFail({
        serialNumber,
      });
      this.logger.debug(`Found microcontroller with SN=${serialNumber}`);
      return controller;
    } catch (e) {
      this.logger.warn(
        `Failed to find microcontroller with SN=${serialNumber}`,
        e,
      );
      throw new NotFoundException(
        `Failed to find microcontroller with SN=${serialNumber}`,
      );
    }
  }

  async findOne(id: number): Promise<Microcontroller> {
    const entity = await this.controllerRepo.findOneBy({ id });
    if (!entity) {
      this.logger.warn(`Microcontroller id=${id} not found`);
      throw new NotFoundException(`Microcontroller with id=${id} not found`);
    }
    this.logger.debug(`Fetched Microcontroller id=${id}`);
    return entity;
  }

  async updateBySerialNumber(sn: string, dto: AdminUpdateMicrocontrollerDto) {
    const existingObject = await this.controllerRepo.findOne({
      where: { serialNumber: sn },
      relations: ['configuration'],
    });

    if (!existingObject) {
      this.logger.warn(
        `Attempted to update non-existing microcontroller with SN=${sn}`,
      );
      throw new NotFoundException(`Microcontroller with SN '${sn}' not found`);
    }

    if (dto.checkpointId) {
      try {
        const checkpoint = await this.checkpointsService.findOne(
          dto.checkpointId,
        );
        if (!checkpoint) throw new Error();
        existingObject.checkpoint = checkpoint;
      } catch {
        throw new NotFoundException('Checkpoint not found');
      }
    }

    if (dto.status) existingObject.status = dto.status;

    if (dto.configurationId) {
      try {
        const config = await this.configsService.findOne(dto.configurationId);
        if (!config) throw new Error();
        existingObject.configuration = config;
      } catch {
        throw new NotFoundException('Configuration not found');
      }
    }

    const result = await this.controllerRepo.save(existingObject);

    this.logger.log(
      `Updated microcontroller SN=${sn}, fields=${Object.keys(dto).join(', ')}`,
    );

    return result;
  }

  async removeBySerialNumber(sn: string) {
    const existingObject = await this.controllerRepo.findOneBy({
      serialNumber: sn,
    });
    if (!existingObject) {
      this.logger.warn(
        `Attempted to delete non-existing microcontroller with SN=${sn}`,
      );
      throw new NotFoundException(`Microcontroller with SN '${sn}' not found`);
    }

    const result = await this.controllerRepo.delete(existingObject.id);
    if (result.affected === 0) {
      this.logger.error(
        `Failed to delete microcontroller SN=${sn} (DB inconsistency?)`,
      );
      throw new NotFoundException(
        `Failed to delete microcontroller with SN '${sn}'`,
      );
    }

    this.logger.log(`Deleted microcontroller SN=${sn}`);
    return { deleted: true };
  }
}
