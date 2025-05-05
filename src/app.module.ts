import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MicrocontrollersModule } from './microcontrollers/microcontrollers.module';

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
      dropSchema: true,
      logging: true,
    }),
    MicrocontrollersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
