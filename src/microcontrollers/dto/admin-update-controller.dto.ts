import { IsEnum, IsOptional, IsString, IsNumber } from 'class-validator';
import { ControllerStatus } from '../entities/microcontrollers.entity';

export class AdminUpdateMicrocontrollerDto {
  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsEnum(ControllerStatus)
  status?: ControllerStatus;

  @IsOptional()
  @IsNumber()
  configurationId?: number;

  @IsOptional()
  @IsNumber()
  checkpointId?: number;
}
