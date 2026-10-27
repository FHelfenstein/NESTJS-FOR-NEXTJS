import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';

export class CreatePostDto {
  @IsString({ message: 'Titulo do post precisa ser uma string.' })
  @Length(10, 150, { message: 'Título precisa ter entre 10 e 150 caracteres.' })
  title: string;

  @IsString({ message: 'Excerto precisa ser uma string.' })
  @Length(10, 200, {
    message: 'Excerto precisa ter entre 10 e 200 caracteres.',
  })
  excerpt: string;

  @IsString({ message: 'Conteúdo precisa ser uma string.' })
  @IsNotEmpty({ message: 'Conteúdo do post é obrigatório.' })
  content: string;

  @IsOptional() // Vai ser requerido no NextJs(Frontend)
  @IsUrl(
    { require_tld: false },
    { message: 'URL da imagem precisa ser uma URL válida' },
  ) // Top level domain proíbe localhost e IP
  coverImageUrl?: string;
}
