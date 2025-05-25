import { Microcontroller } from 'src/microcontrollers/entities/microcontrollers.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Alert {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message: string;

  @Column()
  level: 'INFO' | 'WARNING' | 'CRITICAL';

  @ManyToOne(() => Microcontroller, { nullable: true })
  controller: Microcontroller | null;

  @Column({ type: 'jsonb', nullable: true })
  relatedData?: Record<string, any>; // напр. SensorData snapshot

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  readAt: Date;
}
