import { BadRequestException, Body, Controller, Get, Param, Post, Put, Req, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/users/auth.guard';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { DepositDto } from './dto/deposit-account.dto';

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

    @UseGuards(AuthGuard)
    @Put('deposit/:id')
    deposit(@Body() depositDto: DepositDto, @Request() req, @Param('id') id: number){
        const userId = req?.user.sub as number;

        if(depositDto.amount <= 0){
            throw new BadRequestException('The amount must be greater than 0!')
        }
        
        return this.accountsService.deposit(depositDto, userId, id);
    }


}
