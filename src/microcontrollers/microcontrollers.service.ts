import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Microcontroller } from './entities/microcontrollers.entity';
import { Repository } from 'typeorm';
import { CreateMicrocontrollerDto } from './dto/create-controller.dto';
import { UpdateMicrocontrollerDto } from './dto/update-controller.dto';

@Injectable()
export class MicrocontrollersService {
  private readonly logger = new Logger(MicrocontrollersService.name);

  constructor(
    @InjectRepository(Microcontroller)
    private controllerRepo: Repository<Microcontroller>,
  ) {}

  async create(dto: CreateMicrocontrollerDto) {
    const controller = this.controllerRepo.create(dto);
    const result = await this.controllerRepo.save(controller);
    this.logger.log(
      `Created microcontroller: ${result.serialNumber} (id=${result.id})`,
    );
    return result;
  }

  async findAll() {
    const result = await this.controllerRepo.find();
    this.logger.debug(`Fetched ${result.length} microcontrollers`);
    return result;
  }

  async findOneBySerialNumber(
    serialNumber: string,
  ): Promise<Microcontroller | null> {
    const controller = await this.controllerRepo.findOneBy({ serialNumber });
    this.logger.debug(
      controller
        ? `Found microcontroller with SN=${serialNumber}`
        : `Microcontroller with SN=${serialNumber} not found`,
    );
    return controller;
  }

  async updateBySerialNumber(sn: string, dto: UpdateMicrocontrollerDto) {
    const existingObject = await this.controllerRepo.findOneBy({
      serialNumber: sn,
    });
    if (!existingObject) {
      this.logger.warn(
        `Attempted to update non-existing microcontroller with SN=${sn}`,
      );
      throw new NotFoundException(`Microcontroller with SN '${sn}' not found`);
    }
    Object.assign(existingObject, dto);
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
