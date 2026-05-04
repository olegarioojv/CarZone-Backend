import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Car } from './entities/car.entity';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';

@Injectable()
export class CarsService {
  constructor(
    @InjectRepository(Car)
    private readonly repo: Repository<Car>,
  ) {}

  // 🔐 Criar carro vinculado ao usuário
  async create(data: CreateCarDto, userId: string) {
    const car = this.repo.create({
      ...data,
      user: { id: userId },
    });

    return this.repo.save(car);
  }

  // 📄 Listar todos (com dono)
  findAll() {
    return this.repo.find({
      relations: ['user', 'images'],
    });
  }

  // 🔍 Buscar por ID
  async findOne(id: string) {
    const car = await this.repo.findOne({
      where: { id },
      relations: ['user', 'images'],
    });

    if (!car) {
      throw new NotFoundException('Carro não encontrado');
    }

    return car;
  }

  // 🔒 Deletar (somente dono)
  async remove(id: string, userId: string) {
    const car = await this.repo.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!car) {
      throw new NotFoundException('Carro não encontrado');
    }

    if (car.user.id !== userId) {
      throw new ForbiddenException('Você não pode deletar este carro');
    }

    await this.repo.remove(car);

    return { message: 'Carro deletado com sucesso' };
  }

  async update(id: string, data: UpdateCarDto, userId: string) {
    const car = await this.repo.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!car) {
      throw new NotFoundException('Carro não encontrado');
    }

    if (car.user.id !== userId) {
      throw new ForbiddenException('Você não pode editar este carro');
    }

    Object.assign(car, data);

    return this.repo.save(car);
  }

  findByUser(userId: string) {
    return this.repo.find({
      where: { user: { id: userId } },
    });
  }
}
