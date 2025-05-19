import { PartialType } from '@nestjs/mapped-types';
import { CreateRuleTemplateDto } from './create-rule-template.dto';

export class UpdateRuleTemplateDto extends PartialType(CreateRuleTemplateDto) {}
