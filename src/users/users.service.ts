import { HttpException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './user.entity';
import { BlacklistService } from './services/blacklist.service';
import { UserDto } from './dto/login-user.dto';

@Injectable()
export class UsersService {

    constructor(
        private jwtService: JwtService,
        private blacklistService: BlacklistService,
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) { }

    async login(userDto: UserDto): Promise<string | { access_token: string } | HttpException> {

        const { userName, password } = userDto;

        const user = await this.userRepository.findOneBy({ userName });

        if (!user) {
            // TODO: custom exception
            return new HttpException('User or password invalid', 404);
        }

        const passwordMatch = await this.comparePasswords(password, user.password);

        if (!passwordMatch) {
            return new HttpException('User or password invalid', 404);
        }

        return { access_token: await this.jwtService.sign({ sub: user.id, username: user.userName}) };
    }

    async register(userDto: UserDto): Promise<{ access_token: string } | HttpException> {
        const { userName, password } = userDto;

        const user = await this.userRepository.findOneBy({ userName });

        if (user) {
            return new HttpException('User already exists', 400);
        }

        const encryptedPassword = await this.encryptPassword(password);

        this.userRepository.save({ userName, password: encryptedPassword });

        const payload = { sub: user.id, username: user.userName}

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
