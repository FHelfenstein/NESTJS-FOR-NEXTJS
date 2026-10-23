import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CustomParseIntPipe } from '../common/pipes/custom-parse-int-pipe.js';
import { ConfigService } from '@nestjs/config';
import { UserService } from './user.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id', CustomParseIntPipe) id: number) {
    return `Bem-Vindo usuário #${id}`;
  }

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }
}
