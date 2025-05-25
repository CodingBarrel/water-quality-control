import { IsString, IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class RegisterDeviceDto {
  @IsString()
  localId: string;
  @IsString()
  pin: string;
  @IsOptional()
  @IsNumber()
  level: number;
  @IsOptional()
  @IsBoolean()
  isEnabled: boolean;
  @IsNumber()
  controllerId: number;
}
