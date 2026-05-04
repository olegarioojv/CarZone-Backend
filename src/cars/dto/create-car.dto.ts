import { IsString, IsNumber } from 'class-validator';

export class CreateCarDto {
  @IsString()
  title!: string;

  @IsString()
  brand!: string;

  @IsString()
  model!: string;

  @IsNumber()
  year!: number;

  @IsNumber()
  price!: number;

  @IsNumber()
  km!: number;

  @IsString()
  description!: string;
}
