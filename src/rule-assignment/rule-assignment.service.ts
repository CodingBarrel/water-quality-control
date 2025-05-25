import {
  forwardRef,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateRuleAssignmentDto } from './dto/create-rule-assignment.dto';
import { UpdateRuleAssignmentDto } from './dto/update-rule-assignment.dto';
import { RuleAssignment } from './entities/rule-assignment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { MicrocontrollersService } from 'src/microcontrollers/microcontrollers.service';
import { RuleTemplateService } from 'src/rule-template/rule-template.service';

@Injectable()
export class RuleAssignmentService {
  private readonly logger = new Logger(RuleAssignmentService.name);

  constructor(
    @InjectRepository(RuleAssignment)
    private readonly raRepo: Repository<RuleAssignment>,
    @Inject(forwardRef(() => MicrocontrollersService))
    private readonly mcService: MicrocontrollersService,
    private readonly rtService: RuleTemplateService,
  ) {}

  async create(dto: CreateRuleAssignmentDto) {
    const controller = await this.mcService.findOne(dto.controllerId);
    if (!controller) throw new NotFoundException('Controller not found');

    const template = await this.rtService.findOne(dto.templateId);
    if (!template) throw new NotFoundException('Rule template not found');

    const entity = this.raRepo.create({
      parameterMap: dto.parameterMap,
      isEnabled: dto.isEnabled,
      controller,
      template,
    });

    const saved = await this.raRepo.save(entity);
    this.logger.log(`✅ Created rule assignment: id=${saved.id}`);

    return saved;
  }

  async findAll(): Promise<RuleAssignment[]> {
    const all = await this.raRepo.find({
      relations: ['template', 'controller'],
    });
    this.logger.debug(`Fetched ${all.length} rule assignments`);
    return all;
  }

  async findOne(id: number): Promise<RuleAssignment> {
    const entity = await this.raRepo.findOne({
      where: { id },
      relations: ['template', 'controller'],
    });
    if (!entity) {
      this.logger.warn(`Rule assignment id=${id} not found`);
      throw new NotFoundException(`Rule assignment with id=${id} not found`);
    }
    this.logger.debug(`Fetched rule assignment id=${id}`);
    return entity;
  }

  async findByIds(ids: number[]): Promise<RuleAssignment[]> {
    return this.raRepo.findBy({ id: In(ids) });
  }

  async update(id: number, dto: UpdateRuleAssignmentDto) {
    const entity = await this.raRepo.findOne({
      where: { id },
      relations: ['controller', 'template'], // щоб уникнути затертої прив'язки
    });

    if (!entity) {
      this.logger.warn(`Rule assignment id=${id} not found for update`);
      throw new NotFoundException(`Rule assignment with id=${id} not found`);
    }

    // Оновлення зв’язків
    if (dto.controllerId !== undefined) {
      const controller = await this.mcService.findOne(dto.controllerId);
      if (!controller) throw new NotFoundException('Controller not found');
      entity.controller = controller;
    }

    if (dto.templateId !== undefined) {
      const template = await this.rtService.findOne(dto.templateId);
      if (!template) throw new NotFoundException('Rule template not found');
      entity.template = template;
    }

    // Оновлення звичайних полів
    if (dto.parameterMap !== undefined) {
      entity.parameterMap = dto.parameterMap;
    }

    if (dto.isEnabled !== undefined) {
      entity.isEnabled = dto.isEnabled;
    }

    const updated = await this.raRepo.save(entity);
    this.logger.log(`✅ Updated rule assignment id=${id}`);

    return updated;
  }

  async remove(id: number) {
    const entity = await this.raRepo.findOneBy({ id });
    if (!entity) {
      this.logger.warn(`Rule assignment id=${id} not found for deletion`);
      throw new NotFoundException(`Rule assignment with id=${id} not found`);
    }
    await this.raRepo.delete(id);
    this.logger.log(`Deleted rule assignment id=${id}`);
    return { deleted: true };
  }
}
