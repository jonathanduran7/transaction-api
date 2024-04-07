import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from 'src/transfer/transfer.entity';
import buildQueryOptions from './utils/query-options.helpers';

@Injectable()
export class TransactionService {

    constructor(
        @InjectRepository(Transaction)
        private transactionRepository: Repository<Transaction>,
    ) { }

    async getTransactions(userId: number, fromDate?: Date, toDate?: Date, accountFromId?: number) {
        return this.transactionsByUserId(userId, fromDate, toDate, accountFromId);
    }

    async transactionsByUserId(userId: number, fromDate?: Date, toDate?: Date, accountFromId?: number) {
        const data = await this.transactionRepository.find(buildQueryOptions(userId, fromDate, toDate, accountFromId));
        return data;
    }

}
