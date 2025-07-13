import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../common/interfaces/jwt.payload';
import * as fs from 'fs'
import * as path from 'path';
@Injectable()
export class JwtTokenService {
  constructor(private readonly jwtService: JwtService) { }

  private readPrivateKey() {
    const pathToFile=path.join(process.cwd(),'private.pem')
    console.log(pathToFile)
    const privateKey = fs.readFileSync(pathToFile, 'utf8');
    return privateKey;
  }
  async generateTokens(
    userId: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload: JwtPayload = { sub: userId };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '1d',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  async verifyAccessToken(token: string): Promise<JwtPayload> {
    console.log('Atal matal')
    return this.jwtService.verifyAsync(token, {
      secret: process.env.JWT_ACCESS_SECRET,
    });
  }

  async verifyRefreshToken(token: string): Promise<JwtPayload> {
    return await this.jwtService.verify(token, {
      secret: process.env.JWT_REFRESH_SECRET,
    });
  }

  async generateForgetToken(userId: string): Promise<string> {
    const payload: JwtPayload = { sub: userId };
    const privateKey= this.readPrivateKey()
    const token = await this.jwtService.signAsync(payload, {
      secret: privateKey,
      expiresIn: '15m',
      algorithm: 'RS384'
    });
    return token
  }

  async generateAccessToken(userId: string, expiresIn: string = '5min') {
    const payload: JwtPayload = { sub: userId };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn,
    });
    return accessToken;
  }

  async verifyForgetToken(token: string): Promise<JwtPayload> {
    const privateKey=this.readPrivateKey()
    return await this.jwtService.verify(token, {
      secret: privateKey,
      algorithms: ['RS384']
    });
  }
}
