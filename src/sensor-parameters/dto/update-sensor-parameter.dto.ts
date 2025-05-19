import { PartialType } from '@nestjs/mapped-types';
import { CreateSensorParameterDto } from './create-sensor-parameter.dto';

export class UpdateSensorParameterDto extends PartialType(CreateSensorParameterDto) {}
