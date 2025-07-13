import { Injectable, NotFoundException } from '@nestjs/common';
import { RegisterUserRequestDto } from '../common/dto/registerUserRequestDto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) { }

  async registerUser(data: RegisterUserRequestDto): Promise<UserEntity> {
    let user: UserEntity | null = await this.repository.findOne({
      where: {
        phone: data.phone
      },
    });
    if (!user) {
      user = await this.repository.save({
        phone: data.phone
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

  async findUser(options: FindOneOptions<UserEntity>) {
    return this.repository.findOne(options)
  }

  async userExists(options: FindManyOptions<UserEntity>) {
    return this.repository.exists(options)
  }

  async verifyUserEmail(id: string) {
    return this.repository.update({ id }, { isEmailVerified: true })
  }
}
