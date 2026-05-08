import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Car } from './entities/car.entity';
import { CarsService } from './cars.service';
import { CarsController } from './cars.controller';

import { UploadModule } from '../upload/upload.module';
import { ImagesModule } from '../images/images.module';

@Module({
  imports: [TypeOrmModule.forFeature([Car]), UploadModule, ImagesModule],
  providers: [CarsService],
  controllers: [CarsController],
})
export class CarsModule {}
