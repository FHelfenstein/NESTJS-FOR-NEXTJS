import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto.js';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity.js';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async create(dto: CreatePostDto, author: User) {
    const post = await this.postRepository.create({
      slug: 'asdflbcvcvcvc-' + Math.random().toString(36).substring(2, 8),
      title: dto.title,
      excerpt: dto.excerpt,
      content: dto.content,
      author,
    });

    const created = await this.postRepository.save(post);

    return created;
  }
}
