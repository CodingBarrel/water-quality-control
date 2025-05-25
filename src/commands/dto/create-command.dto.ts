import { IsNumber, IsString } from 'class-validator';

export class CreateCommandDto {
  @IsString()
  deviceLocalId: string;
  @IsNumber()
  level: number;
  @IsNumber()
  delayMs: number;
  @IsNumber()
  controllerId: number;
}
