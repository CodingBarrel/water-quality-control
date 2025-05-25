import { Microcontroller } from 'src/microcontrollers/entities/microcontrollers.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Command {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  deviceLocalId: string;

  @Column({ type: 'float' })
  level: number;

  @Column({ nullable: true })
  delayMs?: number;

  @ManyToOne(() => Microcontroller)
  controller: Microcontroller;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  sentAt?: Date;
}
