import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { OneToMany } from 'typeorm';
import { Car } from '../../cars/entities/car.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Exclude()
  @Column()
  password!: string;

  @OneToMany(() => Car, (car) => car.user)
  cars!: Car[];
}
