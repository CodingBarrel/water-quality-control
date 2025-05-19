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
import { RuleTemplateService } from './rule-template.service';
import { CreateRuleTemplateDto } from './dto/create-rule-template.dto';
import { UpdateRuleTemplateDto } from './dto/update-rule-template.dto';

@Controller('rule-templates')
export class RuleTemplateController {
  private readonly logger = new Logger(RuleTemplateController.name);

  constructor(private readonly ruleTemplateService: RuleTemplateService) {}

  @Post()
  async create(@Body() createRuleTemplateDto: CreateRuleTemplateDto) {
    this.logger.log(`Creating rule parameter: ${createRuleTemplateDto.name}`);
    return this.ruleTemplateService.create(createRuleTemplateDto);
  }

  @Get()
  async findAll() {
    this.logger.debug('Fetching all rule templates');
    return this.ruleTemplateService.findAll();
  }

  @Get(':id/parameters')
  async getParameters(
    @Param('id') id: number,
  ): Promise<{ sensors: string[]; devices: string[] }> {
    return this.ruleTemplateService.getParameters(id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    this.logger.log(`Fetch rule template id=${id}`);
    return this.ruleTemplateService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRuleTemplateDto: UpdateRuleTemplateDto,
  ) {
    this.logger.log(`Updating rule template id=${id}`);
    return this.ruleTemplateService.update(+id, updateRuleTemplateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.logger.warn(`Deleting rule template id=${id}`);
    return this.ruleTemplateService.remove(+id);
  }
}
