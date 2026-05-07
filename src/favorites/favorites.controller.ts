import {
  Controller,
  Post,
  Delete,
  Get,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

import { FavoritesService } from './favorites.service';

type RequestWithUser = Request & {
  user: {
    userId: string;
  };
};

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly service: FavoritesService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post(':carId')
  create(@Param('carId') carId: string, @Req() req: RequestWithUser) {
    return this.service.create(req.user.userId, carId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findMyFavorites(@Req() req: RequestWithUser) {
    return this.service.findByUser(req.user.userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':carId')
  remove(@Param('carId') carId: string, @Req() req: RequestWithUser) {
    return this.service.remove(req.user.userId, carId);
  }
}
