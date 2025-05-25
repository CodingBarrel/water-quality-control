import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MicrocontrollersService } from './microcontrollers.service';
import { MicrocontrollersController } from './microcontrollers.controller';
import { Microcontroller } from './entities/microcontrollers.entity';
import { ConfigurationModule } from 'src/configuration/configuration.module';
import { RuleAssignmentModule } from 'src/rule-assignment/rule-assignment.module';
import { CheckpointsModule } from 'src/checkpoints/checkpoints.module';
import { AlertsModule } from 'src/alerts/alerts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Microcontroller]),
    ConfigurationModule,
    forwardRef(() => RuleAssignmentModule),
    CheckpointsModule,
    AlertsModule,
  ],
  providers: [MicrocontrollersService],
  controllers: [MicrocontrollersController],
  exports: [MicrocontrollersService],
})
export class MicrocontrollersModule {}
