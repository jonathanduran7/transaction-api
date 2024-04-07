import { Module } from '@nestjs/common';
import { AccountsController } from './accounts.controller';
import { BlacklistService } from 'src/users/services/blacklist.service';
import { Account } from './account.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Currency } from './currency.entity';
import { AccountsService } from './accounts.service';
import { ConfigModule } from '@nestjs/config';
import configuration from 'src/config/configuration';


@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    TypeOrmModule.forFeature([Account, Currency]),
  ],
  controllers: [AccountsController],
  providers: [BlacklistService, AccountsService],
  exports: [AccountsService]
})
export class AccountsModule {}
