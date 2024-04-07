import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { BlacklistService } from 'src/users/services/blacklist.service';
import { TransferService } from 'src/transfer/transfer.service';
import { TransferModule } from 'src/transfer/transfer.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from 'src/transfer/transfer.entity';
import { ConfigModule } from '@nestjs/config';
import configuration from 'src/config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    TypeOrmModule.forFeature([
      Transaction
    ]),
  ],
  controllers: [TransactionController],
  providers: [TransactionService, BlacklistService]
})
export class TransactionModule {}
