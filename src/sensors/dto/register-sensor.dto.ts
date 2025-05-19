import { IsString, IsBoolean, IsNumber } from 'class-validator';

export class RegisterSensorDto {
  @IsString()
  localId: string;
  @IsString()
  pin: string;
  @IsNumber()
  delayMS: number;
  @IsBoolean()
  isEnabled: boolean;
}
