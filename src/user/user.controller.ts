import { Body, Controller, Get, Put, Req, UseGuards } from '@nestjs/common';
import { UserService } from './services/user.service';
import { JwtAuthGuard } from 'src/common/guards/jwt.auth.guard';
import { UpdateProfileRequestDto } from './dtos/update.profile.dto';

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
}
