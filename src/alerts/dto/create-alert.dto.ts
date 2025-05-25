import {
  IsString,
  IsEnum,
  IsOptional,
  IsObject,
  IsNumber,
} from 'class-validator';

export class CreateAlertDto {
  @IsString()
  message: string;

  @IsEnum(['INFO', 'WARNING', 'CRITICAL'])
  level: 'INFO' | 'WARNING' | 'CRITICAL';

  @IsNumber()
  @IsOptional()
  controllerId?: number;

  @IsOptional()
  @IsObject()
  relatedData?: Record<string, any>;
}
