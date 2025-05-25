import { IsObject, IsOptional, IsString } from 'class-validator';

export class CreateRuleTemplateDto {
  @IsString()
  name: string;

  @IsObject()
  logic: any; // тут зберігається шаблон JSON

  @IsString()
  @IsOptional()
  description: string;
}
