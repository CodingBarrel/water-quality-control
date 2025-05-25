import { Device } from 'src/devices/entities/device.entity';
import { Sensor } from 'src/sensors/entities/sensor.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { RuleAssignment } from '../../rule-assignment/entities/rule-assignment.entity';
import { Configuration } from '../../configuration/entities/configuration.entity';
import { Checkpoint } from 'src/checkpoints/entities/checkpoint.entity';

export enum ControllerStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  DISABLED = 'DISABLED',
  ERROR = 'ERROR',
}

@Entity()
export class Microcontroller {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  serialNumber: string;

  @Column()
  firmwareVersion: string;

  @Column({ nullable: true })
  ip: string;

  @ManyToOne(() => Checkpoint, { nullable: true })
  checkpoint: Checkpoint;

  @OneToMany(() => RuleAssignment, (ra) => ra.controller, { nullable: true })
  assignedRules: RuleAssignment[];

  @ManyToOne(() => Configuration, { nullable: true })
  configuration: Configuration | null;

  @Column({
    type: 'enum',
    enum: ControllerStatus,
    default: ControllerStatus.PENDING,
  })
  status: ControllerStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  lastSyncedAt: Date;

  @OneToMany(() => Sensor, (sensor) => sensor.controller, { cascade: true })
  sensors: Sensor[];

  @OneToMany(() => Device, (device) => device.controller, { cascade: true })
  devices: Device[];
}
