import { PartialType } from '@nestjs/mapped-types';
import { CreateRuleAssignmentDto } from './create-rule-assignment.dto';

export class UpdateRuleAssignmentDto extends PartialType(
  CreateRuleAssignmentDto,
) {}
