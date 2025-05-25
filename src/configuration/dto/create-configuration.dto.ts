import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateConfigurationDto {
  @IsString()
  name: string;
  @IsNumber()
  getConfigurationUpdateDelay: number;
  @IsNumber()
  sendLogsDelay: number;
  @IsBoolean()
  isDefault: boolean;
}
