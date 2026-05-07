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
import { FilterCarDto } from './dto/filter-car.dto';

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
  async findAll(filters: FilterCarDto) {
    const {
      brand,
      model,
      minYear,
      maxYear,
      minPrice,
      maxPrice,
      page = '1',
      limit = '10',
    } = filters;

    const query = this.repo
      .createQueryBuilder('car')
      .leftJoinAndSelect('car.user', 'user')
      .leftJoinAndSelect('car.images', 'images');

    // 🔍 filtros
    if (brand) {
      query.andWhere('car.brand ILIKE :brand', {
        brand: `%${brand}%`,
      });
    }

    if (model) {
      query.andWhere('car.model ILIKE :model', {
        model: `%${model}%`,
      });
    }

    if (minYear) {
      query.andWhere('car.year >= :minYear', {
        minYear: Number(minYear),
      });
    }

    if (maxYear) {
      query.andWhere('car.year <= :maxYear', {
        maxYear: Number(maxYear),
      });
    }

    if (minPrice) {
      query.andWhere('car.price >= :minPrice', {
        minPrice: Number(minPrice),
      });
    }

    if (maxPrice) {
      query.andWhere('car.price <= :maxPrice', {
        maxPrice: Number(maxPrice),
      });
    }

    // 📄 paginação
    const take = Number(limit);
    const skip = (Number(page) - 1) * take;

    query.skip(skip).take(take);

    // 🔥 ordenação
    query.orderBy('car.createdAt', 'DESC');

    const [cars, total] = await query.getManyAndCount();

    return {
      data: cars,
      total,
      page: Number(page),
      lastPage: Math.ceil(total / take),
    };
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

  async getCategories() {
    const cars = await this.repo.find();

    const categoriesMap = cars.reduce((acc: Record<string, number>, car) => {
      if (!car.category) return acc;

      acc[car.category] = (acc[car.category] || 0) + 1;

      return acc;
    }, {});

    return Object.entries(categoriesMap).map(([name, total]) => ({
      name,
      total,
    }));
  }
}
