import { InternalServerErrorException, Module } from '@nestjs/common';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { UserModule } from '../user/user.module.js';
import { CommomModule } from '../common/common.module.js';
import { JwtModule } from '@nestjs/jwt';
import type { SignOptions } from 'jsonwebtoken';

@Module({
  imports: [
    UserModule,
    CommomModule,
    JwtModule.registerAsync({
      useFactory: () => {
        const secret = process.env.JWT_SECRET_KEY as string;
        const expiration = process.env.JWT_EXPIRATION;

        if (!secret) {
          throw new InternalServerErrorException(
            'JWT_SECRET_KEY not found in .env',
          );
        }

        if (!expiration) {
          throw new InternalServerErrorException(
            'JWT_EXPIRATION not found in .env',
          );
        }

        const expiresIn: SignOptions['expiresIn'] =
          expiration as SignOptions['expiresIn'];

        return {
          secret,
          signOptions: { expiresIn },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [],
})
export class AuthModule {}
