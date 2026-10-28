import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto.js';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity.js';
import { createSlugFromText } from '../common/utils/create-slug-from-text.js';
import { UpdatePostDto } from './dto/update-post.dto.js';

@Injectable()
export class PostService {
  private readonly logger = new Logger(PostService.name);

  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async findOneOrFail(postData: Partial<Post>) {
    const post = await this.findOne(postData);

    if (!post) {
      throw new NotFoundException('Post não encontrado');
    }

    return post;
  }

  async findOne(postData: Partial<Post>) {
    const post = await this.postRepository.findOne({
      where: postData,
      relations: {
        author: true,
      },
    });

    return post;
  }

  async findOneOwnedOrFail(postData: Partial<Post>, author: User) {
    const post = await this.findOneOwned(postData, author);

    if (!post) {
      throw new NotFoundException('Post não encontrado');
    }

    return post;
  }

  async findOneOwned(postData: Partial<Post>, author: User) {
    const post = await this.postRepository.findOne({
      where: {
        ...postData,
        author: { id: author.id },
      },
      relations: {
        author: true,
      },
    });

    return post;
  }

  async findAllOwned(author: User) {
    const posts = await this.postRepository.find({
      where: {
        author: { id: author.id },
      },
      order: {
        createdAt: 'DESC',
      },
      relations: {
        author: true,
      },
    });

    return posts;
  }

  async findAll(postData: Partial<Post>) {
    const posts = await this.postRepository.find({
      where: postData,
      order: {
        createdAt: 'DESC',
      },
      relations: {
        author: true,
      },
    });

    return posts;
  }

  async remove(postData: Partial<Post>, author: User) {
    const post = await this.findOneOrFail(postData);
    await this.postRepository.delete({
      ...postData,
      author: { id: author.id },
    });

    return post;
  }

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

  async update(postData: Partial<Post>, dto: UpdatePostDto, author: User) {
    if (Object.keys(dto).length === 0) {
      throw new BadRequestException('Dados não enviados');
    }

    const post = await this.findOneOwnedOrFail(postData, author);

    post.title = dto.title ?? post.title;
    post.content = dto.content ?? post.content;
    post.excerpt = dto.excerpt ?? post.excerpt;
    post.coverImageUrl = dto.coverImageUrl ?? post.coverImageUrl;
    post.published = dto.published ?? post.published;

    return this.postRepository.save(post);
  }
}
