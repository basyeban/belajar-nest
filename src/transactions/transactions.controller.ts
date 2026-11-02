import {
  Controller,
  Get,
  Post,
  Body,
  Headers,
  Query,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service.js';
import { CreateTransactionDto } from './dto/create-transaction.dto.js';

@Controller('api/transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  private resolveUserId(headerUserId?: string, queryUserId?: string): string {
    return headerUserId || queryUserId || process.env.DEFAULT_USER_ID || 'user_id_123';
  }

  @Get()
  async getTransactions(
    @Query('goalId') goalId?: string,
    @Headers('x-user-id') headerUserId?: string,
    @Query('userId') queryUserId?: string,
  ) {
    const userId = this.resolveUserId(headerUserId, queryUserId);
    const transactions = await this.transactionsService.findAll(userId, goalId);
    return {
      statusCode: 200,
      message: 'Berhasil mengambil riwayat transaksi',
      total: transactions.length,
      data: transactions,
    };
  }

  @Post()
  async createTransaction(
    @Body() createTransactionDto: CreateTransactionDto,
    @Headers('x-user-id') headerUserId?: string,
    @Query('userId') queryUserId?: string,
  ) {
    const userId = this.resolveUserId(headerUserId, queryUserId);
    const result = await this.transactionsService.create(
      userId,
      createTransactionDto,
    );
    return {
      statusCode: 201,
      message:
        createTransactionDto.type === 'deposit'
          ? 'Setoran tabungan berhasil dicatat'
          : 'Penarikan dana berhasil dicatat',
      data: result,
    };
  }
}

