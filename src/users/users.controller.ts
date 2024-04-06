import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserDto } from './dto/login-user.dto';

@Controller('users')
export class UsersController {


    @Post('login')
    login(@Body() loginUserDto: UserDto) {
        return 'This action logs a user in';
    }

    @Post('register')
    register(@Body() registerUserDto: UserDto) {
        return 'This action registers a new user';
    }

    @Get('logout')
    logout() {
        return 'This action logs a user out';
    }

}
