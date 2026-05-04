import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Image } from './entities/image.entity';
import { Car } from '../cars/entities/car.entity';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Image)
    private readonly repo: Repository<Image>,

    @InjectRepository(Car)
    private readonly carRepo: Repository<Car>,

    private readonly uploadService: UploadService,
  ) {}

  async create(url: string, publicId: string, carId: string): Promise<Image> {
    const car = await this.carRepo.findOne({
      where: { id: carId },
    });

    if (!car) {
      throw new NotFoundException('Carro não encontrado');
    }

    const image = this.repo.create({
      url,
      public_id: publicId,
      car,
    });

    return this.repo.save(image);
  }
  async remove(imageId: string, userId: string) {
    const image = await this.repo.findOne({
      where: { id: imageId },
      relations: ['car', 'car.user'],
    });

    if (!image) {
      throw new NotFoundException('Imagem não encontrada');
    }

    // 🔐 só o dono pode deletar
    if (image.car.user.id !== userId) {
      throw new ForbiddenException('Sem permissão');
    }

    // 🔥 deletar no Cloudinary
    await this.uploadService.deleteImage(image.public_id);

    // 🔥 deletar no banco
    await this.repo.delete(imageId);

    return { message: 'Imagem deletada com sucesso' };
  }
}
