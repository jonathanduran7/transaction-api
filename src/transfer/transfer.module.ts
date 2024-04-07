import { Module } from '@nestjs/common';
import { TransferController } from './transfer.controller';
import { BlacklistService } from 'src/users/services/blacklist.service';
import { TransferService } from './transfer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './transfer.entity';
import { AccountsModule } from 'src/accounts/accounts.module';
import { CurrencyConversionService } from './services/currency-conversion.service';
import { CurrencyConversionRecord } from 'src/entities/currency-conversion-record.entity';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import configuration from 'src/config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    TypeOrmModule.forFeature([
      Transaction, CurrencyConversionRecord
    ]),
    AccountsModule,
    CacheModule.register()
  ],
  controllers: [TransferController],
  providers: [BlacklistService, TransferService, CurrencyConversionService],
})
export class TransferModule {}
