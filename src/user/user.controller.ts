import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { CustomParseIntPipe } from '../common/pipes/custom-parse-int-pipe.js';
import { ConfigService } from '@nestjs/config';

@Controller('user')
export class UserController {
  constructor(private readonly configService: ConfigService) {}

  @Get(':id')
  findOne(@Param('id', CustomParseIntPipe) id: number) {
    //console.log(id, typeof id);
    console.log(process.env.TESTE);
    console.log(this.configService.get('ConnectionDB', 'PADRÃO'));
    return `Bem-Vindo usuário #${id}`;
  }
}
