import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RegisterUserRequestDto } from '../common/dto/registerUserRequestDto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { FindManyOptions, FindOneOptions, Repository } from 'typeorm';
import { UserMetaEntity } from './entities/userMeta.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(UserMetaEntity)
    private readonly userMetaRepository: Repository<UserMetaEntity>,
  ) {}

  async registerUser({ phone }: RegisterUserRequestDto): Promise<UserEntity> {
    const isUserExists = await this.userExists({
      where: { phone: phone },
    });

    if (isUserExists) throw new BadRequestException();

    const user = this.userRepository.create({ phone });
    await this.userRepository.save(user);

    const userMeta = this.userMetaRepository.create({ user });
    await this.userMetaRepository.save(userMeta);

    return user;
  }

  async findUserById(id: string): Promise<UserEntity> {
    const user: UserEntity | null = await this.userRepository.findOne({
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
    return this.userRepository.findOne(options);
  }

  async userExists(options: FindManyOptions<UserEntity>) {
    return this.userRepository.exists(options);
  }

  async verifyUserEmail(id: string, email: string) {
    return this.userRepository.update({ id }, { isEmailVerified: true, email });
  }
}
