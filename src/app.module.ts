import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { CarsModule } from './cars/cars.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ImagesModule } from './images/images.module';

@Module({
  imports: [
    // 🔥 carrega .env
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // 🔥 usa variáveis do .env direto
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || '',
      port: parseInt(process.env.DB_PORT || '', 10),
      username: process.env.DB_USER || '',
      password: process.env.DB_PASS || '',
      database: process.env.DB_NAME || '',

      autoLoadEntities: true,
      synchronize: true,
    }),

    CarsModule,
    UsersModule,
    AuthModule,
    ImagesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
