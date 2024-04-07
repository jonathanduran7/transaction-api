import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAccountDto } from './dto/create-account.dto';
import { Account } from './account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Currency } from './currency.entity';
import { DepositDto } from './dto/deposit-account.dto';

@Injectable()
export class AccountsService {

    constructor(
        @InjectRepository(Account)
        private accountRepository: Repository<Account>,
        @InjectRepository(Currency)
        private currencyRepository: Repository<Currency>
    ) { }

    async getAccounts(userId: number) {

        const accounts = await this.accountRepository.find({
            relations: ['currency'],
            select: {
                id: true,
                balance: true,
                currency: {
                    currencyName: true
                }
            },
            where: { user: { id: userId } }
        })

        return accounts;
    }

    async createAccount(accountDto: CreateAccountDto, userId: number) {

        const currency = await this.currencyRepository.findOneBy({ id: accountDto.currencyId });

        if (!currency) {
            return 'Currency not found';
        }

        await this.accountRepository.save({ balance: accountDto.balance, currency, user: { id: userId } });

        return 'Account created'
    }

    async findAccount(accountId: number) {
        return this.accountRepository.findOne({
            relations: ['currency', 'user'],
            where: { id: accountId },
            select: {
                id: true,
                balance: true,
                currency: {
                    id: true,
                    currencyName: true
                },
                user: {
                    id: true
                }
            }
        })
    }

    async updateBalance(accountId: number, amount: number) {
        return this.accountRepository.update({ id: accountId }, { balance: amount });
    }

    async deposit(depositDto: DepositDto, userId: number, accountId: number) {
        const account = await this.findAccount(accountId);

        if (!account) {
            throw new BadRequestException('Account not found');
        }

        if (account.user.id !== userId) {
            throw new BadRequestException('You are not authorized to make this deposit!');
        }

        account.balance += depositDto.amount;

        await this.updateBalance(accountId, account.balance);

        return 'Deposit completed successfully!';
    }
}
