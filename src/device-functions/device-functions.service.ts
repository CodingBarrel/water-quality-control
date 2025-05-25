import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DeviceFunction } from './entities/device-function.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDeviceFunctionDto } from './dto/create-device-function.dto';
import { Repository } from 'typeorm';
import { UpdateDeviceFunctionDto } from './dto/update-device-function.dto';

@Injectable()
export class DeviceFunctionsService {
  private readonly logger = new Logger(DeviceFunctionsService.name);

  constructor(
    @InjectRepository(DeviceFunction)
    private readonly repo: Repository<DeviceFunction>,
  ) {}

  async create(dto: CreateDeviceFunctionDto) {
    const entity = this.repo.create(dto);
    const saved = await this.repo.save(entity);
    this.logger.log(`Created device function: ${saved.name} (id=${saved.id})`);
    return saved;
  }

  async findAll(): Promise<DeviceFunction[]> {
    const all = await this.repo.find();
    this.logger.debug(`Fetched ${all.length} device functions`);
    return all;
  }

  async findOne(id: number): Promise<DeviceFunction> {
    const entity = await this.repo.findOneBy({ id });
    if (!entity) {
      this.logger.warn(`device function id=${id} not found`);
      throw new NotFoundException(`device function with id=${id} not found`);
    }
    this.logger.debug(`Fetched device function id=${id}`);
    return entity;
  }

  async update(id: number, dto: UpdateDeviceFunctionDto) {
    const entity = await this.repo.findOneBy({ id });
    if (!entity) {
      this.logger.warn(`device function id=${id} not found for update`);
      throw new NotFoundException(`device function with id=${id} not found`);
    }
    Object.assign(entity, dto);
    const updated = await this.repo.save(entity);
    this.logger.log(`Updated device function id=${id}`);
    return updated;
  }

  async remove(id: number) {
    const entity = await this.repo.findOneBy({ id });
    if (!entity) {
      this.logger.warn(`device function id=${id} not found for deletion`);
      throw new NotFoundException(`device function with id=${id} not found`);
    }
    await this.repo.delete(id);
    this.logger.log(`Deleted device function id=${id}`);
    return { deleted: true };
  }
}
