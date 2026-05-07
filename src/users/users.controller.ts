import { Controller, Post, Body, Get, Param } from '@nestjs/common';

import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @ApiOperation({
    summary: 'Criar usuário',
  })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso',
  })
  @Post()
  create(@Body() body: CreateUserDto) {
    return this.service.create(body);
  }

  @ApiOperation({
    summary: 'Listar usuários',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de usuários',
  })
  @Get()
  findAll() {
    return this.service.findAll();
  }

  @ApiOperation({
    summary: 'Buscar usuário por ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário encontrado',
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }
}
