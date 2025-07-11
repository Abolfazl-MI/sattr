import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserDataAccess } from 'src/user/user.data-access.service';
import { BookDataAccess } from '../services/book.data-access.service';
import { MoreThan } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { SingleIdValidator } from 'src/common/dtos/single-id-validator';
import { validateSync } from 'class-validator';
import { BookEntity } from '../entities/book.entity';

@Injectable()
export class AccessEpisodeGuard implements CanActivate {
  constructor(
    private readonly userDataAccess: UserDataAccess,
    private readonly bookDataAccess: BookDataAccess,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest();
      const userId = (request as any).user?.id;
      const episodeId = request?.params?.episodeId;
      const bookId = request.params.bookId;

      // Validate is ids uuid
      await this.validateId(bookId || episodeId);

      let book: BookEntity | null | undefined = null;

      // Find book by episodeId or bookId
      if (bookId) {
        book = await this.bookDataAccess.findOneById({ id: bookId });
      } else {
        const findEpisode = await this.bookDataAccess.findOneEpisode({
          where: { id: episodeId },
          relations: {
            book: true,
          },
        });

        book = findEpisode?.book;
      }

      if (book?.isIndividual) {
        const userMeta = await this.userDataAccess.exists({
          where: {
            user: { id: userId },
            books: {
              id: book.id,
            },
          },
        });

        if (userMeta) return true;
      } else {
        const userMeta = await this.userDataAccess.exists({
          where: {
            user: { id: userId },
            subscriptionExpiresAt: MoreThan(new Date()),
          },
        });

        if (userMeta) return true;
      }

      return false;
    } catch (error) {
      console.log(error);

      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException(
        'Something happened in server! try again later',
      );
    }
  }

  async validateId(id: string) {
    const dto = plainToInstance(SingleIdValidator, { id });
    const errors = validateSync(dto);

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
  }
}
