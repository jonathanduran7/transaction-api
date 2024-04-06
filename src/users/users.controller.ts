import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserDto } from './dto/login-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {

    constructor(private userService: UsersService){}

    @Post('login')
    login(@Body() loginUserDto: UserDto) {
        return this.userService.login(loginUserDto);
    }

    @Post('register')
    register(@Body() registerUserDto: UserDto) {
        return this.userService.register(registerUserDto);
    }

    @Get('logout')
    logout() {
        return this.userService.logout();
    }

}
