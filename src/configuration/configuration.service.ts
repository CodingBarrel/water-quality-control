import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateConfigurationDto } from './dto/create-configuration.dto';
import { UpdateConfigurationDto } from './dto/update-configuration.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Configuration } from './entities/configuration.entity';

@Injectable()
export class ConfigurationService {
  private readonly logger = new Logger(ConfigurationService.name);

  constructor(
    @InjectRepository(Configuration)
    private readonly cRepo: Repository<Configuration>,
  ) {}

  async create(dto: CreateConfigurationDto) {
    const entity = this.cRepo.create(dto);
    const saved = await this.cRepo.save(entity);
    this.logger.log(`Created configuration: ${saved.name} (id=${saved.id})`);
    return saved;
  }

  async findAll(): Promise<Configuration[]> {
    const all = await this.cRepo.find();
    this.logger.debug(`Fetched ${all.length} configurations`);
    return all;
  }

  async findOne(id: number): Promise<Configuration> {
    const entity = await this.cRepo.findOneBy({ id });
    if (!entity) {
      this.logger.warn(`Cconfiguration id=${id} not found`);
      throw new NotFoundException(`Configuration with id=${id} not found`);
    }
    this.logger.debug(`Fetched configuration id=${id}`);
    return entity;
  }

  async findDefaultOne(): Promise<Configuration> {
    const entity = await this.cRepo.findOneBy({ isDefault: true });
    if (!entity) {
      this.logger.warn(`Default configuration not found`);
      throw new NotFoundException(`Default configuration not found`);
    }
    this.logger.debug(`Fetched default configuration [${entity.name}]`);
    return entity;
  }

  async update(id: number, dto: UpdateConfigurationDto) {
    const entity = await this.cRepo.findOneBy({ id });
    if (!entity) {
      this.logger.warn(`Configuration id=${id} not found for update`);
      throw new NotFoundException(`Configuration with id=${id} not found`);
    }
    Object.assign(entity, dto);
    const updated = await this.cRepo.save(entity);
    this.logger.log(`Updated configuration id=${id}`);
    return updated;
  }

  async remove(id: number) {
    const entity = await this.cRepo.findOneBy({ id });
    if (!entity) {
      this.logger.warn(`Configuration id=${id} not found for deletion`);
      throw new NotFoundException(`Configuration with id=${id} not found`);
    }
    await this.cRepo.delete(id);
    this.logger.log(`Deleted configuration id=${id}`);
    return { deleted: true };
  }
}
