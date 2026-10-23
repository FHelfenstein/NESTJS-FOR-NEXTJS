import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login-dto.js';
import { UserService } from '../user/user.service.js';
import { HashingService } from '../common/hashing/hashing.service.js';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../types/jwt-payload.type.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
  ) {}

  async doLogin(loginDto: LoginDto) {
    const user = await this.userService.findByEmail(loginDto.email);
    const error = new UnauthorizedException('Usuário ou senha inválidos.');

    if (!user) {
      throw error;
    }

    const isPasswordValid = await this.hashingService.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw error;
    }

    const JwtPaylod: JwtPayload = {
      sub: user.id.trim(),
      email: user.email.trim(),
    };

    const accessToken = await this.jwtService.signAsync(JwtPaylod);

    user.forceLogout = false;
    await this.userService.save(user);

    return { accessToken };
  }
}
