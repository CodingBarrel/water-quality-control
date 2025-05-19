import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateCommandDto } from './dto/create-command.dto';
import { UpdateCommandDto } from './dto/update-command.dto';
import { Command } from './entities/command.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CommandsService {
  private readonly logger = new Logger(CommandsService.name);

  constructor(
    @InjectRepository(Command)
    private readonly repo: Repository<Command>,
  ) {}

  async create(dto: CreateCommandDto) {
    const entity = this.repo.create(dto);
    const saved = await this.repo.save(entity);
    this.logger.log(`Created command id=${saved.id})`);
    return saved;
  }

  async findAll(): Promise<Command[]> {
    const all = await this.repo.find();
    this.logger.debug(`Fetched ${all.length} commands`);
    return all;
  }

  async findOne(id: number): Promise<Command> {
    const entity = await this.repo.findOneBy({ id });
    if (!entity) {
      this.logger.warn(`command id=${id} not found`);
      throw new NotFoundException(`command with id=${id} not found`);
    }
    this.logger.debug(`Fetched command id=${id}`);
    return entity;
  }

  async update(id: number, dto: UpdateCommandDto) {
    const entity = await this.repo.findOneBy({ id });
    if (!entity) {
      this.logger.warn(`command id=${id} not found for update`);
      throw new NotFoundException(`command with id=${id} not found`);
    }
    Object.assign(entity, dto);
    const updated = await this.repo.save(entity);
    this.logger.log(`Updated command id=${id}`);
    return updated;
  }

  async remove(id: number) {
    const entity = await this.repo.findOneBy({ id });
    if (!entity) {
      this.logger.warn(`command id=${id} not found for deletion`);
      throw new NotFoundException(`command with id=${id} not found`);
    }
    await this.repo.delete(id);
    this.logger.log(`Deleted command id=${id}`);
    return { deleted: true };
  }
}
