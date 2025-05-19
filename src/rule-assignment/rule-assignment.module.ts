import { forwardRef, Module } from '@nestjs/common';
import { RuleAssignmentService } from './rule-assignment.service';
import { RuleAssignmentController } from './rule-assignment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RuleAssignment } from './entities/rule-assignment.entity';
import { MicrocontrollersModule } from 'src/microcontrollers/microcontrollers.module';
import { RuleTemplateModule } from 'src/rule-template/rule-template.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RuleAssignment]),
    forwardRef(() => MicrocontrollersModule),
    RuleTemplateModule,
  ],
  controllers: [RuleAssignmentController],
  providers: [RuleAssignmentService],
  exports: [RuleAssignmentService],
})
export class RuleAssignmentModule {}
