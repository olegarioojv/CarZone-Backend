import { TypeOrmModule } from '@nestjs/typeorm';
import { Image } from './entities/image.entity';
import { Car } from '../cars/entities/car.entity';
import { ImagesService } from './images.service';
import { Module } from '@nestjs/common/decorators/modules/module.decorator';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [TypeOrmModule.forFeature([Image, Car]), UploadModule],
  providers: [ImagesService],
  exports: [ImagesService],
})
export class ImagesModule {}
