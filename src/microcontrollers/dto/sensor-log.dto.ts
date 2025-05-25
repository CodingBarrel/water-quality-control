import { IsNumber, IsString, IsOptional, IsDateString } from 'class-validator';

export class SensorLogDto {
  @IsNumber()
  sensorId: number;

  @IsNumber()
  value: number;

  @IsString()
  @IsOptional()
  unit?: string;

  @IsDateString()
  @IsOptional()
  timestamp?: string;
}
