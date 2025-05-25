import { PartialType } from '@nestjs/mapped-types';
import { RegisterDeviceDto } from './register-device.dto';

export class UpdateDeviceDto extends PartialType(RegisterDeviceDto) {}
