import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Checkpoint } from './entities/checkpoint.entity';
import { Repository } from 'typeorm';
import { CreateCheckpointDto } from './dto/create-checkpoint.dto';
import { UpdateCheckpointDto } from './dto/update-checkpoint.dto';

@Injectable()
export class CheckpointsService {
  private readonly logger = new Logger(CheckpointsService.name);
  constructor(
    @InjectRepository(Checkpoint)
    private readonly repo: Repository<Checkpoint>,
  ) {}

  async create(dto: CreateCheckpointDto) {
    const entity = this.repo.create(dto);
    const saved = await this.repo.save(entity);
    this.logger.log(`Created checkpoint: ${saved.name} (id=${saved.id})`);
    return saved;
  }

  async findAll() {
    const all = await this.repo.find();
    this.logger.log(`Fetched ${all.length} checkpoints`);
    return all;
  }

  async findOne(id: number): Promise<Checkpoint> {
    const entity = await this.repo.findOneBy({ id });
    if (!entity) {
      this.logger.warn(`Checkpoint id=${id} not found`);
      throw new NotFoundException(`Checkpoint with id=${id} not found`);
    }
    this.logger.debug(`Fetched checkpoint id=${id}`);
    return entity;
  }

  async update(id: number, dto: UpdateCheckpointDto) {
    const entity = await this.repo.findOneBy({ id });
    if (!entity) {
      this.logger.warn(`Checkpoint id=${id} not found for update`);
      throw new NotFoundException(`Checkpoint with id=${id} not found`);
    }
    Object.assign(entity, dto);
    const updated = await this.repo.save(entity);
    this.logger.log(`Updated checkpoint id=${id}`);
    return updated;
  }

  async remove(id: number) {
    const entity = await this.repo.findOneBy({ id });
    if (!entity) {
      this.logger.warn(`Checkpoint id=${id} not found for deletion`);
      throw new NotFoundException(`Checkpoint with id=${id} not found`);
    }
    await this.repo.delete(id);
    this.logger.log(`Deleted checkpoint id=${id}`);
    return { deleted: true };
  }
}
