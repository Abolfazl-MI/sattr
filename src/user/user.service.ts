import { Injectable, NotFoundException } from '@nestjs/common';
import { RegisterUserRequestDto } from '../common/dto/registerUserRequestDto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}

  async registerUser(data: RegisterUserRequestDto): Promise<UserEntity> {
    let user: UserEntity | null = await this.repository.findOne({
      where: {
        ...data,
      },
    });
    if (!user) {
      user = await this.repository.save({
        ...data,
      });
      return user;
    } else {
      return user;
    }
  }

  async findUserById(id: string): Promise<UserEntity> {
    const user: UserEntity | null = await this.repository.findOne({
      where: {
        id,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
