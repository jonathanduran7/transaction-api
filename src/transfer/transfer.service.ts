import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateTransferDto } from './dto/transfer.dto';
import { AccountsService } from 'src/accounts/accounts.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transfer.entity';
import { CurrencyConversionService } from './services/currency-conversion.service';

@Injectable()
export class TransferService {

    constructor(
        private accountService: AccountsService,
        @InjectRepository(Transaction)
        private transactionRepository: Repository<Transaction>,
        private currencyConversionService: CurrencyConversionService
    ) { }

    async transferMoney(transferDto: CreateTransferDto, userId: number) {
        const [accountFrom, accountTo] = await Promise.all([
            this.accountService.findAccount(transferDto.accountFrom),
            this.accountService.findAccount(transferDto.accountTo)
        ])

        if (accountFrom.user.id !== userId) {
            throw new BadRequestException('You are not authorized to make this transfer!')
        }

        if (!accountFrom || !accountTo) {
            throw new BadRequestException('One of the accounts does not exist!')
        }

        const dateTransaction = new Date(transferDto.date);
        const isSameCurrency = accountFrom.currency.id === accountTo.currency.id;
        const isSameUser = accountFrom.user.id === accountTo.user.id;
        const fee = isSameUser ? 0 : transferDto.amount * 0.01;

        const dataSave = {
            accountFrom,
            accountTo,
            amount: transferDto.amount,
            date: dateTransaction,
            description: transferDto.description,
            accountToBalance: accountTo.balance + transferDto.amount,
            accountFromBalance: accountFrom.balance - transferDto.amount - fee,
        }

        if (dataSave.accountFromBalance < 0) {
            throw new BadRequestException('You do not have enough funds to make this transfer!')
        }

        if (!isSameCurrency) {
            const data = await this.currencyConversionService.convert({
                to: accountTo.currency.currencyName,
                from: accountFrom.currency.currencyName,
                amount: transferDto.amount,
                date: transferDto.date
            })

            dataSave.accountToBalance = accountTo.balance + data.result;
        }

        await Promise.all([
            this.transactionRepository.save(dataSave),
            this.accountService.updateBalance(accountFrom.id, dataSave.accountFromBalance),
            this.accountService.updateBalance(accountTo.id, dataSave.accountToBalance)
        ])

        return 'Transfer completed successfully!'
    }
}
