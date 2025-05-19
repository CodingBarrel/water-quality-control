import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateAlertDto } from './dto/create-alert.dto';
import { UpdateAlertDto } from './dto/update-alert.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Alert } from './entities/alert.entity';

@Injectable()
export class AlertsService {
  private readonly logger = new Logger(AlertsService.name);

  constructor(
    @InjectRepository(Alert)
    private readonly repo: Repository<Alert>,
  ) {}

  async create(dto: CreateAlertDto) {
    const entity = this.repo.create(dto);
    const saved = await this.repo.save(entity);
    this.logger.log(
      `Created alert for: ${saved.controller?.id} (id=${saved.id})`,
    );
    return saved;
  }

  async findAll(): Promise<Alert[]> {
    const all = await this.repo.find();
    this.logger.debug(`Fetched ${all.length} alert`);
    return all;
  }

  async findOne(id: number): Promise<Alert> {
    const entity = await this.repo.findOneBy({ id });
    if (!entity) {
      this.logger.warn(`alert id=${id} not found`);
      throw new NotFoundException(`alert with id=${id} not found`);
    }
    this.logger.debug(`Fetched alert id=${id}`);
    return entity;
  }

  async update(id: number, dto: UpdateAlertDto) {
    const entity = await this.repo.findOneBy({ id });
    if (!entity) {
      this.logger.warn(`alert id=${id} not found for update`);
      throw new NotFoundException(`alert with id=${id} not found`);
    }
    Object.assign(entity, dto);
    const updated = await this.repo.save(entity);
    this.logger.log(`Updated alert id=${id}`);
    return updated;
  }

  async updateReadDate(id: number) {
    const entity = await this.repo.findOneBy({ id });
    if (!entity) {
      this.logger.warn(`alert id=${id} not found for readAt update`);
      throw new NotFoundException(`alert with id=${id} not found`);
    }

    entity.readAt = new Date();
    const updated = await this.repo.save(entity);

    this.logger.log(
      `Marked alert id=${id} as read at ${entity.readAt.toISOString()}`,
    );
    return updated;
  }

  async remove(id: number) {
    const entity = await this.repo.findOneBy({ id });
    if (!entity) {
      this.logger.warn(`alert id=${id} not found for deletion`);
      throw new NotFoundException(`alert with id=${id} not found`);
    }
    await this.repo.delete(id);
    this.logger.log(`Deleted alert id=${id}`);
    return { deleted: true };
  }
}
