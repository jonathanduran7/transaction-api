import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UserDto } from './dto/login-user.dto';
import { UsersService } from './users.service';
import { AuthGuard } from './auth.guard';

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
    @UseGuards(AuthGuard)
    logout(@Req() request): string {
        const token = request.headers.authorization.split(' ')[1];
        return this.userService.logout(token);
    }

}
