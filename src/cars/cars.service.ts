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

  // 🔐 Criar carro
  async create(data: CreateCarDto, userId: string) {
    const car = this.repo.create({
      ...data,

      user: {
        id: userId,
      },
    });

    return this.repo.save(car);
  }

  // 📄 Listar carros
  async findAll(filters: FilterCarDto) {
    const {
      brand,
      model,
      category,
      search,
      sort,
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

    // 🔍 busca global
    if (search) {
      query.andWhere(
        `
          (
            car.brand ILIKE :search
            OR car.model ILIKE :search
            OR car.category ILIKE :search
            OR CAST(car.year AS TEXT) ILIKE :search
          )
        `,
        {
          search: `%${search}%`,
        },
      );
    }

    // 🔍 filtro marca
    if (brand) {
      query.andWhere('car.brand ILIKE :brand', {
        brand: `%${brand}%`,
      });
    }

    // 🔍 filtro modelo
    if (model) {
      query.andWhere('car.model ILIKE :model', {
        model: `%${model}%`,
      });
    }

    // 🔍 filtro categoria
    if (category) {
      query.andWhere('car.category ILIKE :category', {
        category: `%${category}%`,
      });
    }

    // 🔍 ano mínimo
    if (minYear) {
      query.andWhere('car.year >= :minYear', {
        minYear: Number(minYear),
      });
    }

    // 🔍 ano máximo
    if (maxYear) {
      query.andWhere('car.year <= :maxYear', {
        maxYear: Number(maxYear),
      });
    }

    // 🔍 preço mínimo
    if (minPrice) {
      query.andWhere('car.price >= :minPrice', {
        minPrice: Number(minPrice),
      });
    }

    // 🔍 preço máximo
    if (maxPrice) {
      query.andWhere('car.price <= :maxPrice', {
        maxPrice: Number(maxPrice),
      });
    }

    // 🔥 ordenação
    if (sort === 'price_asc') {
      query.orderBy('car.price', 'ASC');
    } else if (sort === 'price_desc') {
      query.orderBy('car.price', 'DESC');
    } else {
      query.orderBy('car.createdAt', 'DESC');
    }

    // 📄 paginação
    const take = Number(limit);

    const skip = (Number(page) - 1) * take;

    query.skip(skip).take(take);

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

  // ✏️ Atualizar carro
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

  // 🗑️ Deletar carro
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

    return {
      message: 'Carro deletado com sucesso',
    };
  }

  // 👤 Carros usuário
  findByUser(userId: string) {
    return this.repo.find({
      where: {
        user: {
          id: userId,
        },
      },

      relations: ['images'],
    });
  }

  // 📂 Categorias
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

  // 🚘 Marcas
  async getBrands() {
    const cars = await this.repo.find();

    const brands = [...new Set(cars.map((car) => car.brand))];

    return brands.filter(Boolean);
  }

  // 🚗 Modelos
  async getModels() {
    const cars = await this.repo.find();

    const models = [...new Set(cars.map((car) => car.model))];

    return models.filter(Boolean);
  }
}
