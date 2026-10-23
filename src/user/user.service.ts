import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity.js';
import { HashingService } from '../common/hashing/hashing.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingService,
  ) {}

  async create(dto: CreateUserDto) {
    const userExists = await this.userRepository.exists({
      where: {
        email: dto.email,
      },
    });

    if (userExists) {
      throw new ConflictException('E-mail já existe.');
    }

    const hashedPassword = await this.hashingService.hash(dto.password);

    const newUser: CreateUserDto = {
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
    };

    const created = await this.userRepository.save(newUser);
    return created;
  }

  findByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  save(user: User) {
    return this.userRepository.save(user);
  }
}
