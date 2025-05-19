import { PartialType } from '@nestjs/mapped-types';
import { RegisterMicrocontrollerDto } from './register-controller.dto';

export class UpdateMicrocontrollerDto extends PartialType(
  RegisterMicrocontrollerDto,
) {}
