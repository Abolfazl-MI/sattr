import { Injectable, NotFoundException } from '@nestjs/common';
import { RegisterUserRequestDto } from '../../common/dto/registerUserRequestDto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { UserDataAcess } from './user.dataAcess.service';
import { SingleIdValidator } from 'src/common/dtos/single-id-validator';
import { UpdateProfileRequestDto } from '../dtos/update.profile.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userDataAcess: UserDataAcess
  ) { }

  async registerUser(data: RegisterUserRequestDto): Promise<UserEntity> {
    return this.userDataAcess.registerUser(data);
  }

  async findUserById(id: string): Promise<UserEntity> {
    return this.userDataAcess.findUserById(id)
  }

  async getUserProfile(id: SingleIdValidator) {
    return this.userDataAcess.getUserProfile(id)
  }
  async updateUserProfie(id: SingleIdValidator, request: UpdateProfileRequestDto) {
    return this.userDataAcess.updateProfile(id.id, request)
  }
}
