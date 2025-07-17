import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";

import { InjectRepository } from "@nestjs/typeorm";
import { BookDataAccess } from "src/book/services/book.data-access.service";
import { FindOneOptions, Repository } from "typeorm";
import { RegisterUserRequestDto } from "src/common/dto/registerUserRequestDto";
import { SingleIdValidator } from "src/common/dtos/single-id-validator";
import { UpdateProfileRequestDto } from "../dtos/update.profile.dto";
import { UserEntity } from "../entities/user.entity";
import { UserMetaEntity } from "../entities/userMeta.entity";

@Injectable()
export class UserDataAccess {
    constructor(
        @InjectRepository(UserEntity) private readonly repository: Repository<UserEntity>,
        @InjectRepository(UserMetaEntity)
        private userMetaRepository: Repository<UserMetaEntity>,
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

    async getUserProfile({ id }: SingleIdValidator) {
        // todo return plan information from user meta
        const profile = await this.repository.findOne({
            where: {
                id: id,
                isActive: true
            },
            select: {
                id: true,
                name: true,
                email: true,
                profilePicture: true,
                phone: true,
            }
        })
        if (!profile) {
            throw new NotFoundException('User not found')
        }
        return profile;
    }
    async updateProfile(id: string, request: UpdateProfileRequestDto) {
        const result = await this.repository.update({ id }, {
            ...request,
        })
        if (result.affected && result.affected > 0) {
            return {
                message: 'profile updated'
            }
        } else if (result.affected === 0) {
            throw new InternalServerErrorException()
        }
    }
    async findUser(options: FindOneOptions<UserEntity>) {
        return this.repository.findOne(options)
    }
    async userExists(options: FindOneOptions<UserEntity>) {
        return this.repository.exists(options)
    }

    async verifyUserEmail(id: string, email: string) {
        return this.repository.update({ id }, { isEmailVerified: true, email });
    }

    async updateUser(options: Partial<UserEntity>) {
        return this.repository.update({ id: options.id }, options);
    }

    async updateUserMeta(userMeta: Partial<UserMetaEntity>) {
        return this.repository.save(userMeta);
    }
    async exists(options: FindOneOptions<UserEntity>) {
        return this.repository.exists(options)
    }
    async userMetaExists(options: FindOneOptions<UserMetaEntity>) {
        return this.userMetaRepository.exists(options)
    }
}