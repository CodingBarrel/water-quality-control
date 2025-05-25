import { IsString, IsOptional, IsNumber } from 'class-validator';

export class RegisterMicrocontrollerDto {
  @IsString()
  serialNumber: string;

  @IsString()
  firmwareVersion: string;

  @IsOptional()
  @IsString()
  ip?: string;

  @IsOptional()
  @IsNumber()
  configurationId: number;
}
