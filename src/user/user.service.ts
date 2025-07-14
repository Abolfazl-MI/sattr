import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RegisterUserRequestDto } from '../common/dto/registerUserRequestDto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { encodePassword } from 'src/common/utils/bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}

  async registerUser(data: RegisterUserRequestDto): Promise<UserEntity> {
    const isUserExists = await this.userExists({
      where: { phone: data.phone },
    });

    if (isUserExists) throw new BadRequestException();

    return await this.repository.save({
      phone: data.phone,
      password: encodePassword(data.password),
    });
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
    return this.repository.findOne(options);
  }

  async userExists(options: FindManyOptions<UserEntity>) {
    return this.repository.exists(options);
  }

  async verifyUserEmail(id: string) {
    return this.repository.update({ id }, { isEmailVerified: true ,  });
  }
}
