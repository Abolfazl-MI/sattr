import { Injectable } from "@nestjs/common";
import { EpisodeEntity } from "./entities/episode.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";



@Injectable()
export class EpisodeDataAccess {

    constructor(
        @InjectRepository(EpisodeEntity)
        private readonly repository: Repository<EpisodeEntity>,
    ) { }

    createQueryBuilder(ailias: string) {
        return this.repository.createQueryBuilder(ailias)
    }
    //TODO: in refator phase migrate book data acess to use this data accss
}