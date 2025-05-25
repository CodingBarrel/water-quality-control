import { PartialType } from '@nestjs/mapped-types';
import { CreateDeviceFunctionDto } from './create-device-function.dto';

export class UpdateDeviceFunctionDto extends PartialType(CreateDeviceFunctionDto) {}
