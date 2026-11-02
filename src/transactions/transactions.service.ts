import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service.js';
import { CreateTransactionDto } from './dto/create-transaction.dto.js';
import { Transaction, Goal } from '../firebase/firebase.types.js';

@Injectable()
export class TransactionsService {
  constructor(private readonly firebaseService: FirebaseService) {}

  async findAll(userId: string, goalId?: string): Promise<Transaction[]> {
    return this.firebaseService.getTransactions(userId, goalId);
  }

  async create(
    userId: string,
    dto: CreateTransactionDto,
  ): Promise<{ transaction: Transaction; updatedGoal: Goal }> {
    const amount = Number(dto.amount);
    if (isNaN(amount) || amount <= 0) {
      throw new BadRequestException('Nominal transaksi harus bernilai angka positif (> 0).');
    }

    if (!['deposit', 'withdraw'].includes(dto.type)) {
      throw new BadRequestException('Tipe transaksi harus "deposit" atau "withdraw".');
    }

    // 1. Validasi keberadaan Target Tabungan
    const goal = await this.firebaseService.getGoalById(userId, dto.goalId);
    if (!goal) {
      throw new NotFoundException(
        `Target tabungan dengan ID "${dto.goalId}" tidak ditemukan.`,
      );
    }

    const currentBalance = Number(goal.current) || 0;
    let newBalance = currentBalance;

    // 2. Validasi Penarikan (Withdraw) agar tidak melebihi saldo saat ini
    if (dto.type === 'withdraw') {
      if (amount > currentBalance) {
        throw new BadRequestException(
          `Penarikan gagal: Saldo saat ini (Rp ${currentBalance.toLocaleString('id-ID')}) tidak mencukupi untuk penarikan sebesar Rp ${amount.toLocaleString('id-ID')}.`,
        );
      }
      newBalance = currentBalance - amount;
    } else {
      // 3. Setoran (Deposit)
      newBalance = currentBalance + amount;
    }

    // 4. Update saldo terkumpul (current) pada target tabungan
    const updatedGoal = await this.firebaseService.updateGoal(userId, dto.goalId, {
      current: newBalance,
    });

    // 5. Format waktu transaksi
    const now = new Date();
    const formattedDate =
      dto.date ||
      `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
        now.getDate(),
      ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(
        now.getMinutes(),
      ).padStart(2, '0')}`;

    // 6. Rekam transaksi
    const newTransaction = await this.firebaseService.createTransaction(userId, {
      goalId: dto.goalId,
      goalTitle: goal.title,
      type: dto.type,
      amount,
      note: dto.note?.trim() || (dto.type === 'deposit' ? 'Setoran tabungan' : 'Penarikan tabungan'),
      date: formattedDate,
    });

    return {
      transaction: newTransaction,
      updatedGoal,
    };
  }
}

