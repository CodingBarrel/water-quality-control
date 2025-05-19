import { PartialType } from '@nestjs/mapped-types';
import { RegisterSensorDto } from './register-sensor.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateSensorDto extends PartialType(RegisterSensorDto) {
  @IsOptional()
  @IsNumber()
  parameterId: number | null;
}
