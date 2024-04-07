import { Module } from '@nestjs/common';
import { AccountsController } from './accounts.controller';
import { BlacklistService } from 'src/users/services/blacklist.service';
import { Account } from './account.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Currency } from './currency.entity';
import { AccountsService } from './accounts.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([Account, Currency]),
  ],
  controllers: [AccountsController],
  providers: [BlacklistService, AccountsService],
  exports: [AccountsService]
})
export class AccountsModule {}
