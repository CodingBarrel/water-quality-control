import { Microcontroller } from 'src/microcontrollers/entities/microcontrollers.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { SensorParameter } from '../../sensor-parameters/entities/sensor-parameter.entity';

@Entity()
export class Sensor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  localId: string;

  @ManyToOne(() => SensorParameter, { eager: true, nullable: true })
  parameter: SensorParameter | null;

  @Column()
  pin: string;

  @Column({ default: true })
  isEnabled: boolean;

  @Column({ default: 60000 })
  delayMS: number;

  @ManyToOne(() => Microcontroller, (controller) => controller.sensors)
  controller: Microcontroller;
}
