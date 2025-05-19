import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Checkpoint {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column('double precision')
  latitude: number;
  @Column('double precision')
  longitude: number;
  @Column({ nullable: true })
  description: string;
  @CreateDateColumn()
  createdAt: Date;
  @Column({ default: false })
  isActive: boolean;
}
