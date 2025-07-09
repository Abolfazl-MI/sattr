import { Injectable, NotFoundException } from "@nestjs/common";
import { UserEntity } from "../entity/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { BookDataAccess } from "src/book/services/book.data-access.service";
import { Repository } from "typeorm";
import { RegisterUserRequestDto } from "src/common/dto/registerUserRequestDto";
import { SingleIdValidator } from "src/common/dtos/single-id-validator";

@Injectable()
export class UserDataAcess {
    constructor(
        @InjectRepository(UserEntity) private readonly repository: Repository<UserEntity>,
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
}