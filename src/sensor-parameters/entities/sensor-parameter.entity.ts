import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SensorParameter {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  unit: string;
}
