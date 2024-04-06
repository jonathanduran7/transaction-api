import { Controller, Get, Post } from '@nestjs/common';

@Controller('users')
export class UsersController {


    @Post('login')
    login() {
        return 'This action logs a user in';
    }

    @Post('register')
    register() {
        return 'This action registers a new user';
    }

    @Get('logout')
    logout() {
        return 'This action logs a user out';
    }

}
