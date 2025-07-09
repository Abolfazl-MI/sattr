import { Body, Controller, Get, Put, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './services/user.service';
import { JwtAuthGuard } from 'src/common/guards/jwt.auth.guard';
import { UpdateProfileRequestDto } from './dtos/update.profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/common/utills/upload.config';
import path, { join, relative } from 'path';
import { SingleIdValidator } from 'src/common/dtos/single-id-validator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  async getUserProfiel(
    @Req() request: Express.Request
  ) {
    console.log(request.user)
    return this.userService.getUserProfile({ id: request.user.id })
  }

  @UseGuards(JwtAuthGuard)
  @Put('/profile')
  @UseInterceptors(FileInterceptor('profile', multerOptions))
  async updateUserProfiel(
    @Req() request: Express.Request,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UpdateProfileRequestDto
  ) {
    if (file) {
      const absoluteFilePath = file.path; // this comes from Multer
      const uploadsPath = join(process.cwd(), 'public');
      const relativePath = relative(uploadsPath, absoluteFilePath);
      body.profilePicture = relativePath;
    }

    return this.userService.updateUserProfie(new SingleIdValidator(request.user.id), body)
  }
}
