import { BadRequestException, Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/users/auth.guard';
import { CreateTransferDto } from './dto/transfer.dto';
import { TransferService } from './transfer.service';

@Controller('transfer')
export class TransferController {

  constructor(private transferService: TransferService) { }

  @UseGuards(AuthGuard)
  @Post()
  transfer(@Body() transferDto: CreateTransferDto, @Request() req) {
    const userId = req?.user.sub as number;

    if (transferDto.amount <= 0) {
      throw new BadRequestException('The amount must be greater than 0!')
    }

    if (transferDto.accountFrom === transferDto.accountTo) {
      throw new BadRequestException('You cannot transfer money to the same account!')
    }

    return this.transferService.transferMoney(transferDto, userId);
  }
}
