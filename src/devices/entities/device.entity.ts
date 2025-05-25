import { DeviceFunction } from 'src/device-functions/entities/device-function.entity';
import { Microcontroller } from 'src/microcontrollers/entities/microcontrollers.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Device {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  localId: string;

  @Column()
  pin: string;

  @Column()
  level: number;

  @ManyToOne(() => DeviceFunction, { eager: true, nullable: true })
  function: DeviceFunction;

  @ManyToOne(() => Microcontroller, (controller) => controller)
  controller: Microcontroller;

  @Column({ default: true })
  isEnabled: boolean;
}
