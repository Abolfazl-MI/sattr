import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entity/user.entity';
import { Repository } from 'typeorm';
import { UserMetaEntity } from './entity/userMeta.entity';

@Injectable()
export class UserDataAccess {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,

    @InjectRepository(UserMetaEntity)
    private userMetaRepository: Repository<UserMetaEntity>,
  ) {}

  findUserMeta(id: string) {
    return this.userMetaRepository.findOne({
      where: { user: { id } },
      relations: { books: true },
    });
  }

  updateUserMeta(userMeta: Partial<UserMetaEntity>) {
    return this.userMetaRepository.save(userMeta);
  }
}
