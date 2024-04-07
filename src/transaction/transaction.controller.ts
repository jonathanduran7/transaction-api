import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/users/auth.guard';
import { TransactionService } from './transaction.service';

@Controller('transactions')
export class TransactionController {

    constructor(private transactionService: TransactionService) { }

    @UseGuards(AuthGuard)
    @Get()
    getTransactions(
        @Request() req,
        @Query('from') from: string,
        @Query('to') to: string,
        @Query('accountFromId') accountFromId: number
    ) {
        const userId = req?.user.sub as number;
        return this.transactionService.getTransactions(userId, new Date(from), new Date(to), accountFromId);
    }

}
