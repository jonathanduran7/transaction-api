import { Injectable } from '@nestjs/common';
import { UserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { BlacklistService } from './services/blacklist.service';

@Injectable()
export class UsersService {

    private users: UserDto[] = [];

    constructor(
        private jwtService: JwtService,
        private blacklistService: BlacklistService) { }

    async login(userDto: UserDto): Promise<string | { access_token: string }> {

        const { userName, password } = userDto;

        const user = this.users.find(user => user.userName === userName);

        if (!user) {
            return 'User not found';
        }

        const passwordMatch = await this.comparePasswords(password, user.password);

        if (!passwordMatch) {
            return 'Invalid password';
        }

        return { access_token: await this.jwtService.sign({ sub: userName }) };
    }

    async register(userDto: UserDto): Promise<{ access_token: string }> {
        const { userName, password } = userDto;

        const encryptedPassword = await this.encryptPassword(password);

        this.users.push({ userName, password: encryptedPassword });

        const payload = { sub: userName };

        return {
            access_token: await this.jwtService.sign(payload),
        }
    }

    logout(token: string) {
        this.blacklistService.addToBlacklist(token);
        return 'Logged out';
    }

    async encryptPassword(password: string): Promise<string> {
        const salt = 10;
        return await bcrypt.hash(password, salt);
    }

    async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

}
