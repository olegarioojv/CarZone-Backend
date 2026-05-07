import { ApiProperty } from '@nestjs/swagger';

import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'João Victor',
    description: 'Nome do usuário',
  })
  @IsString()
  name!: string;

  @ApiProperty({
    example: 'joao@email.com',
    description: 'Email do usuário',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: '123456',
    description: 'Senha do usuário',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password!: string;
}
