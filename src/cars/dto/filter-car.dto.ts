import { IsOptional, IsString } from 'class-validator';

export class FilterCarDto {
  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  sort?: string;

  @IsOptional()
  minYear?: string;

  @IsOptional()
  maxYear?: string;

  @IsOptional()
  minPrice?: string;

  @IsOptional()
  maxPrice?: string;

  @IsOptional()
  page?: string;

  @IsOptional()
  limit?: string;
}
