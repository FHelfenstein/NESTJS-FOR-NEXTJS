import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto.js';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity.js';
import { createSlugFromText } from '../common/utils/create-slug-from-text.js';

@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name);

  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async create(dto: CreatePostDto, author: User) {
    const post = await this.postRepository.create({
      slug: createSlugFromText(dto.title),
      title: dto.title,
      excerpt: dto.excerpt,
      content: dto.content,
      author,
    });

    const created = await this.postRepository
      .save(post)
      .catch((error: unknown) => {
        if (error instanceof Error) {
          this.logger.error('Erro ao criar post', error.stack);
        }

        throw new BadRequestException('Erro ao criar o post');
      });

    return created;
  }
}
