import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

import { Car } from '../../cars/entities/car.entity';

@Entity()
export class Image {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  url!: string;

  @Column() // 🔥 NOVO
  public_id!: string;

  @ManyToOne(() => Car, (car) => car.images, {
    onDelete: 'CASCADE',
  })
  car!: Car;
}
