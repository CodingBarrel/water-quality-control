import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MicrocontrollersModule } from './microcontrollers/microcontrollers.module';
import { SensorsModule } from './sensors/sensors.module';
import { DevicesModule } from './devices/devices.module';
import { UsersModule } from './users/users.module';
import { AlertsModule } from './alerts/alerts.module';
import { ConfigurationModule } from './configuration/configuration.module';
import { SensorParametersModule } from './sensor-parameters/sensor-parameters.module';
import { DeviceFunctionsModule } from './device-functions/device-functions.module';
import { RuleTemplateModule } from './rule-template/rule-template.module';
import { RuleAssignmentModule } from './rule-assignment/rule-assignment.module';
import { CommandsModule } from './commands/commands.module';
import { MongooseModule } from '@nestjs/mongoose';
import { SensorLogsModule } from './logs/sensor-logs.module';
import { CheckpointsModule } from './checkpoints/checkpoints.module';
import { LoggingMiddleware } from './middleware/logging.middleware';
import { MonitoringModule } from './monitoring/monitoring.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'root',
      database: 'water-quality-control',
      schema: 'water-quality',
      autoLoadEntities: true,
      synchronize: true,
      dropSchema: false,
      logging: false,
    }),
    MongooseModule.forRoot('mongodb://localhost:27017/water-quality', {}),
    MicrocontrollersModule,
    SensorsModule,
    DevicesModule,
    UsersModule,
    AlertsModule,
    ConfigurationModule,
    SensorParametersModule,
    DeviceFunctionsModule,
    RuleTemplateModule,
    RuleAssignmentModule,
    CommandsModule,
    SensorLogsModule,
    CheckpointsModule,
    MonitoringModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
