import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Logger,
} from '@nestjs/common';
import { RuleAssignmentService } from './rule-assignment.service';
import { CreateRuleAssignmentDto } from './dto/create-rule-assignment.dto';
import { UpdateRuleAssignmentDto } from './dto/update-rule-assignment.dto';

@Controller('rule-assignments')
export class RuleAssignmentController {
  private readonly logger = new Logger(RuleAssignmentController.name);

  constructor(private readonly ruleAssignmentService: RuleAssignmentService) {}

  @Post()
  async create(@Body() dto: CreateRuleAssignmentDto) {
    this.logger.log(
      `Creating rule assignment for controller: ${dto.controllerId}`,
    );
    return this.ruleAssignmentService.create(dto);
  }

  @Get()
  async findAll() {
    this.logger.debug('Fetching all rule assignments');
    return this.ruleAssignmentService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    this.logger.log(`Fetch rule assignment id=${id}`);
    return this.ruleAssignmentService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRuleTemplateDto: UpdateRuleAssignmentDto,
  ) {
    this.logger.log(`Updating rule assignment id=${id}`);
    return this.ruleAssignmentService.update(+id, updateRuleTemplateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.logger.warn(`Deleting rule assignment id=${id}`);
    return this.ruleAssignmentService.remove(+id);
  }
}
