import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  doLogin() {
    return 'Autenticação realizada com sucesso!';
  }
}
