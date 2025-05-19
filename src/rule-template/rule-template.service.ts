import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateRuleTemplateDto } from './dto/create-rule-template.dto';
import { UpdateRuleTemplateDto } from './dto/update-rule-template.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { RuleTemplate } from './entities/rule-template.entity';

@Injectable()
export class RuleTemplateService {
  private readonly logger = new Logger(RuleTemplateService.name);

  constructor(
    @InjectRepository(RuleTemplate)
    private readonly rtRepo: Repository<RuleTemplate>,
  ) {}

  async create(dto: CreateRuleTemplateDto) {
    const entity = this.rtRepo.create(dto);
    const saved = await this.rtRepo.save(entity);
    this.logger.log(`Created rule template: ${saved.name} (id=${saved.id})`);
    return saved;
  }

  async findAll(): Promise<RuleTemplate[]> {
    const all = await this.rtRepo.find();
    this.logger.debug(`Fetched ${all.length} rule templates`);
    return all;
  }

  async findOne(id: number): Promise<RuleTemplate> {
    const entity = await this.rtRepo.findOneBy({ id });
    if (!entity) {
      this.logger.warn(`Rule template id=${id} not found`);
      throw new NotFoundException(`Rule template with id=${id} not found`);
    }
    this.logger.debug(`Fetched rule template id=${id}`);
    return entity;
  }

  async findByIds(ids: number[]): Promise<RuleTemplate[]> {
    return this.rtRepo.findBy({ id: In(ids) });
  }

  async update(id: number, dto: UpdateRuleTemplateDto) {
    const entity = await this.rtRepo.findOneBy({ id });
    if (!entity) {
      this.logger.warn(`Rule template id=${id} not found for update`);
      throw new NotFoundException(`Rule template with id=${id} not found`);
    }
    Object.assign(entity, dto);
    const updated = await this.rtRepo.save(entity);
    this.logger.log(`Updated rule template id=${id}`);
    return updated;
  }

  async remove(id: number) {
    const entity = await this.rtRepo.findOneBy({ id });
    if (!entity) {
      this.logger.warn(`Rule template id=${id} not found for deletion`);
      throw new NotFoundException(`Rule template with id=${id} not found`);
    }
    await this.rtRepo.delete(id);
    this.logger.log(`Deleted rule template id=${id}`);
    return { deleted: true };
  }

  async getParameters(
    templateId: number,
  ): Promise<{ sensors: string[]; devices: string[] }> {
    const template = await this.rtRepo.findOne({ where: { id: templateId } });
    if (!template) {
      throw new NotFoundException(
        `RuleTemplate with id ${templateId} not found`,
      );
    }

    let logic: any;
    try {
      logic =
        typeof template.logic === 'string'
          ? JSON.parse(template.logic)
          : template.logic;
    } catch (e) {
      throw new BadRequestException('Invalid JSON in logic field');
    }

    return extractLogicParameters(logic);
  }
}

function extractLogicParameters(logic: any): {
  sensors: string[];
  devices: string[];
} {
  const sensors = new Set<string>();
  const devices = new Set<string>();

  function traverse(obj: any) {
    if (Array.isArray(obj)) {
      obj.forEach(traverse);
    } else if (typeof obj === 'object' && obj !== null) {
      if (typeof obj.sensor === 'string') {
        sensors.add(obj.sensor);
      }
      if (typeof obj.device === 'string') {
        devices.add(obj.device);
      }
      Object.values(obj).forEach(traverse);
    }
  }

  traverse(logic);
  return {
    sensors: Array.from(sensors),
    devices: Array.from(devices),
  };
}
