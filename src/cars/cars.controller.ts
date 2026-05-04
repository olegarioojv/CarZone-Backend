import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  UseGuards,
  Patch,
  ParseUUIDPipe,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { UploadService } from '../upload/upload.service';
import { ImagesService } from '../images/images.service';

type RequestWithUser = Request & {
  user: {
    userId: string;
    email: string;
  };
};

@Controller('cars')
export class CarsController {
  constructor(
    private readonly service: CarsService,
    private readonly uploadService: UploadService,
    private readonly imagesService: ImagesService,
  ) {}

  // 🔐 Criar carro
  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() body: CreateCarDto, @Req() req: RequestWithUser) {
    return this.service.create(body, req.user.userId);
  }

  // 📄 Listar todos
  @Get()
  findAll() {
    return this.service.findAll();
  }

  // 🔐 Meus carros (vem antes de :id)
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getMyCars(@Req() req: RequestWithUser) {
    return this.service.findByUser(req.user.userId);
  }

  // 🔍 Buscar por ID
  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.findOne(id);
  }

  // 🔐 Upload de imagem
  @UseGuards(AuthGuard('jwt'))
  @Post(':id/upload')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @Param('id', new ParseUUIDPipe()) id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const result = await this.uploadService.uploadImage(file);
    return this.imagesService.create(result.secure_url, result.public_id, id);
  }

  // 🔐 Atualizar carro
  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: UpdateCarDto,
    @Req() req: RequestWithUser,
  ) {
    return this.service.update(id, body, req.user.userId);
  }

  // 🔐 Deletar carro
  @UseGuards(AuthGuard('jwt'))
  @Delete('/image/:imageId')
  deleteImage(@Param('imageId') imageId: string, @Req() req: RequestWithUser) {
    return this.imagesService.remove(imageId, req.user.userId);
  }
}
