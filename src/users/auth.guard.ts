import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { BlacklistService } from "./services/blacklist.service";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(
        private jwtService: JwtService,
        private blacklistService: BlacklistService,
        private configService: ConfigService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.getToken(request);
        if (!token || this.blacklistService.isTokenBlacklisted(token)) throw new UnauthorizedException();

        try {
            const payload = await this.jwtService.verifyAsync(token, { secret: this.configService.get('JWT_SECRET') });

            request['user'] = payload;
        } catch (error) {
            throw new UnauthorizedException();
        }

        return true;
    }

    private getToken(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}