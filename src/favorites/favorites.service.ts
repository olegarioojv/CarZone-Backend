import { Injectable, BadRequestException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Favorite } from './entities/favorite.entity';
import { Car } from '../cars/entities/car.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private readonly repo: Repository<Favorite>,

    @InjectRepository(Car)
    private readonly carRepo: Repository<Car>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(userId: string, carId: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
    });

    const car = await this.carRepo.findOne({
      where: { id: carId },
    });

    if (!user || !car) {
      throw new BadRequestException('Usuário ou carro inválido');
    }

    const exists = await this.repo.findOne({
      where: {
        user: { id: userId },
        car: { id: carId },
      },
    });

    if (exists) {
      throw new BadRequestException('Carro já favoritado');
    }

    const favorite = this.repo.create({
      user,
      car,
    });

    return this.repo.save(favorite);
  }

  async findByUser(userId: string) {
    return this.repo.find({
      where: {
        user: { id: userId },
      },
      relations: ['car', 'car.images'],
    });
  }

  async remove(userId: string, carId: string) {
    const favorite = await this.repo.findOne({
      where: {
        user: { id: userId },
        car: { id: carId },
      },
    });

    if (!favorite) {
      throw new BadRequestException('Favorito não encontrado');
    }

    await this.repo.delete(favorite.id);

    return {
      message: 'Favorito removido',
    };
  }
}
