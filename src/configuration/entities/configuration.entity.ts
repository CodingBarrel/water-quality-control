import { Microcontroller } from '../../microcontrollers/entities/microcontrollers.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Configuration {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column({ default: 30 })
  getConfigurationUpdateDelay: number;

  @Column({ default: 30 })
  sendLogsDelay: number;

  @Column({ default: false })
  isDefault: boolean;

  @OneToMany(
    () => Microcontroller,
    (microcontroller) => microcontroller.configuration,
  )
  microcontrollers: Microcontroller[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
