import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import {
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { UserMetaEntity } from './entities/userMeta.entity';
import { BookEntity } from 'src/book/entities/book.entity';

@Injectable()
export class UserDataAccess {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,

    @InjectRepository(UserMetaEntity)
    private userMetaRepository: Repository<UserMetaEntity>,
  ) {}

  findUserMeta(options: FindOneOptions<UserMetaEntity>) {
    return this.userMetaRepository.findOne(options);
  }

  exists(options: FindManyOptions<UserMetaEntity>) {
    return this.userMetaRepository.exists(options);
  }

  updateUser(options: Partial<UserEntity>) {
    return this.userRepository.update({ id: options.id }, options);
  }

  updateUserMeta(userMeta: Partial<UserMetaEntity>) {
    return this.userMetaRepository.save(userMeta);
  }
}
