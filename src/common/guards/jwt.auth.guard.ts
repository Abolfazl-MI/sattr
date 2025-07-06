import { CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { JwtTokenService } from "src/auth/jwt.service";
import { Request } from 'express';
import { JwtPayload } from "../interfaces/jwt.payload";
import { UserService } from "src/user/user.service";

export class JwtAuthGuard implements CanActivate {
    constructor(
        private readonly jwtTokenService: JwtTokenService,
        private readonly userService: UserService
    ) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const authHeader = request.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException('Missing or invalid token');
        }
        const token = authHeader.split(' ')[1];
        try {
            const decoded: JwtPayload = await this.jwtTokenService.verifyAccessToken(token)
            const user = await this.userService.findUserById(decoded.sub);
            if (!user) throw new UnauthorizedException('user not found')
            request.user = user;
            return true;
        } catch (e) {
            if (process.env.NODE_ENV) {
                console.log(e)
            }
            throw new UnauthorizedException('user not found')
        }
    }
}