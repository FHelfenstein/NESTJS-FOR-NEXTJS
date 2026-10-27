import { IsEmail, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'Nome precisa ser uma string' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  name: string;

  @IsEmail({}, { message: 'E-mail inválido' })
  @IsNotEmpty({ message: 'E-mail é obrigatório' })
  email: string;

  @IsString({ message: 'Senha precisa ser uma string' })
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @Min(6, { message: 'Senha deve ter no mínimo 6 caracteres' })
  password: string;
}
