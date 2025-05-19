import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RuleTemplate } from '../../rule-template/entities/rule-template.entity';
import { Microcontroller } from '../../microcontrollers/entities/microcontrollers.entity';

@Entity()
export class RuleAssignment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => RuleTemplate)
  template: RuleTemplate;

  @ManyToOne(() => Microcontroller, (mc) => mc.assignedRules)
  controller: Microcontroller;

  @Column('jsonb')
  parameterMap: {
    sensors: Record<string, string>;
    devices: Record<string, string>;
  };

  @Column({ default: true })
  isEnabled: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
