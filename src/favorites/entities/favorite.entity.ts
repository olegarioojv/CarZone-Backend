import { Entity, PrimaryGeneratedColumn, ManyToOne, Unique } from 'typeorm';

import { User } from '../../users/entities/user.entity';
import { Car } from '../../cars/entities/car.entity';

@Entity()
@Unique(['user', 'car'])
export class Favorite {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  user!: User;

  @ManyToOne(() => Car, {
    onDelete: 'CASCADE',
  })
  car!: Car;
}
