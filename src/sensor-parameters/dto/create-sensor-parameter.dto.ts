import { IsString } from 'class-validator';

export class CreateSensorParameterDto {
  @IsString()
  name: string;
  @IsString()
  unit: string;
}
