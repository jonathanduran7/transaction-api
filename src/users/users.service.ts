import { Injectable } from '@nestjs/common';
import { UserDto } from './dto/login-user.dto';

@Injectable()
export class UsersService {

    login(userDto: UserDto) {
        return 'This action logs a user in';
    }

    register(userDto: UserDto) {
        return 'This action registers a new user';
    }

    logout() {
        return 'This action logs a user out';
    }

}
