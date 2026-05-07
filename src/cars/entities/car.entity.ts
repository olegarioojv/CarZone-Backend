import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Image } from '../../images/entities/image.entity';

@Entity()
export class Car {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column()
  brand!: string;

  @Column()
  model!: string;

  @Column()
  year!: number;

  @Column('float')
  price!: number;

  @Column()
  km!: number;

  @Column()
  description!: string;

  @ManyToOne(() => User, (user) => user.id)
  user!: User;

  @OneToMany(() => Image, (image) => image.car)
  images!: Image[];

  @CreateDateColumn()
  createdAt!: Date;
}
