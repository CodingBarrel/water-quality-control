import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateSensorParameterDto } from './dto/create-sensor-parameter.dto';
import { UpdateSensorParameterDto } from './dto/update-sensor-parameter.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SensorParameter } from './entities/sensor-parameter.entity';

@Injectable()
export class SensorParametersService {
  private readonly logger = new Logger(SensorParametersService.name);

  constructor(
    @InjectRepository(SensorParameter)
    private readonly parameterRepo: Repository<SensorParameter>,
  ) {}

  async create(dto: CreateSensorParameterDto) {
    const entity = this.parameterRepo.create(dto);
    const saved = await this.parameterRepo.save(entity);
    this.logger.log(`Created sensor parameter: ${saved.name} (id=${saved.id})`);
    return saved;
  }

  async findAll(): Promise<SensorParameter[]> {
    const all = await this.parameterRepo.find();
    this.logger.debug(`Fetched ${all.length} sensor parameters`);
    return all;
  }

  async findOne(id: number): Promise<SensorParameter> {
    const entity = await this.parameterRepo.findOneBy({ id });
    if (!entity) {
      this.logger.warn(`SensorParameter id=${id} not found`);
      throw new NotFoundException(`SensorParameter with id=${id} not found`);
    }
    this.logger.debug(`Fetched SensorParameter id=${id}`);
    return entity;
  }
  async update(id: number, dto: UpdateSensorParameterDto) {
    const entity = await this.parameterRepo.findOneBy({ id });
    if (!entity) {
      this.logger.warn(`SensorParameter id=${id} not found for update`);
      throw new NotFoundException(`SensorParameter with id=${id} not found`);
    }
    Object.assign(entity, dto);
    const updated = await this.parameterRepo.save(entity);
    this.logger.log(`Updated sensor parameter id=${id}`);
    return updated;
  }

  async remove(id: number) {
    const entity = await this.parameterRepo.findOneBy({ id });
    if (!entity) {
      this.logger.warn(`SensorParameter id=${id} not found for deletion`);
      throw new NotFoundException(`SensorParameter with id=${id} not found`);
    }
    await this.parameterRepo.delete(id);
    this.logger.log(`Deleted sensor parameter id=${id}`);
    return { deleted: true };
  }
}
