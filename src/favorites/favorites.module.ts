import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { FavoritesService } from './favorites.service';
import { FavoritesController } from './favorites.controller';

import { Favorite } from './entities/favorite.entity';
import { User } from '../users/entities/user.entity';
import { Car } from '../cars/entities/car.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Favorite, User, Car])],
  controllers: [FavoritesController],
  providers: [FavoritesService],
})
export class FavoritesModule {}
