import { IsBoolean, IsNumber, IsObject } from 'class-validator';

export class CreateRuleAssignmentDto {
  @IsNumber()
  templateId: number;
  @IsNumber()
  controllerId: number;
  @IsObject()
  parameterMap: {
    sensors: Record<string, string>;
    devices: Record<string, string>;
  };

  @IsBoolean()
  isEnabled: boolean;
}
