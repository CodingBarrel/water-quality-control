import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class DeviceFunction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;
}
