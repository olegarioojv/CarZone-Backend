import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('login')
  @ApiOperation({
    summary: 'Realizar login',
  })
  @ApiResponse({
    status: 200,
    description: 'Login realizado com sucesso',
  })
  login(@Body() body: LoginDto) {
    return this.service.login(body.email, body.password);
  }
}
