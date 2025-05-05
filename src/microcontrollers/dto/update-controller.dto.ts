import { PartialType } from '@nestjs/mapped-types';
import { CreateMicrocontrollerDto } from './create-controller.dto';

export class UpdateMicrocontrollerDto extends PartialType(
  CreateMicrocontrollerDto,
) {}
