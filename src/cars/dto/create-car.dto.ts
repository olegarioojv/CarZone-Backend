import { ApiProperty } from '@nestjs/swagger';

import { IsString, IsNumber } from 'class-validator';

export class CreateCarDto {
  @ApiProperty({
    example: 'BMW 320i',
  })
  @IsString()
  title!: string;

  @ApiProperty({
    example: 'BMW',
  })
  @IsString()
  brand!: string;

  @ApiProperty({
    example: 'SUV',
  })
  @IsString()
  category!: string;

  @ApiProperty({
    example: '320i',
  })
  @IsString()
  model!: string;

  @ApiProperty({
    example: 2022,
  })
  @IsNumber()
  year!: number;

  @ApiProperty({
    example: 180000,
  })
  @IsNumber()
  price!: number;

  @ApiProperty({
    example: 10000,
  })
  @IsNumber()
  km!: number;

  @ApiProperty({
    example: 'Carro de luxo',
  })
  @IsString()
  description!: string;
}
