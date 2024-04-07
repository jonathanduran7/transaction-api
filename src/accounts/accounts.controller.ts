import { Body, Controller, Get, Post, Req, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/users/auth.guard';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';

@Controller('accounts')
export class AccountsController {

    constructor(
        private accountsService: AccountsService
    ){}

    @UseGuards(AuthGuard)
    @Get()
    getAccounts(@Request() req) {
        const userId = req?.user.sub as number;
        return this.accountsService.getAccounts(userId);
    }

    @UseGuards(AuthGuard)
    @Post()
    createAccount(@Body() createAccountDto: CreateAccountDto, @Request() req) {
        const userId = req?.user.sub as number;
        return this.accountsService.createAccount(createAccountDto, userId);
    }

}
