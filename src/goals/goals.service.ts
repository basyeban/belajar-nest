import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service.js';
import { CreateGoalDto } from './dto/create-goal.dto.js';
import { UpdateGoalDto } from './dto/update-goal.dto.js';
import { Goal } from '../firebase/firebase.types.js';

@Injectable()
export class GoalsService {
  constructor(private readonly firebaseService: FirebaseService) {}

  async findAll(userId: string): Promise<Goal[]> {
    return this.firebaseService.getGoals(userId);
  }

  async findOne(userId: string, id: string): Promise<Goal> {
    const goal = await this.firebaseService.getGoalById(userId, id);
    if (!goal) {
      throw new NotFoundException(`Target tabungan dengan ID "${id}" tidak ditemukan.`);
    }
    return goal;
  }

  async create(userId: string, dto: CreateGoalDto): Promise<Goal> {
    if (!dto.title || dto.title.trim().length === 0) {
      throw new BadRequestException('Nama target / impian wajib diisi.');
    }
    if (!dto.target || Number(dto.target) <= 0) {
      throw new BadRequestException('Nominal target tabungan harus bernilai positif.');
    }
    if (!dto.category) {
      throw new BadRequestException('Kategori tabungan wajib dipilih.');
    }
    if (!dto.targetDate) {
      throw new BadRequestException('Target tenggat waktu (deadline) wajib diisi.');
    }

    const validColors = ['emerald', 'blue', 'purple', 'amber', 'rose'];
    const chosenColor = dto.color && validColors.includes(dto.color.toLowerCase())
      ? dto.color.toLowerCase()
      : 'emerald';

    return this.firebaseService.createGoal(userId, {
      title: dto.title.trim(),
      target: Number(dto.target),
      current: dto.current ? Math.max(0, Number(dto.current)) : 0,
      category: dto.category.trim(),
      targetDate: dto.targetDate,
      color: chosenColor,
    });
  }

  async update(userId: string, id: string, dto: UpdateGoalDto): Promise<Goal> {
    const existing = await this.firebaseService.getGoalById(userId, id);
    if (!existing) {
      throw new NotFoundException(`Target tabungan dengan ID "${id}" tidak ditemukan.`);
    }

    const updates: Partial<Goal> = {};

    if (dto.title !== undefined) {
      if (!dto.title.trim()) {
        throw new BadRequestException('Nama target tidak boleh kosong.');
      }
      updates.title = dto.title.trim();
    }

    if (dto.target !== undefined) {
      const numTarget = Number(dto.target);
      if (isNaN(numTarget) || numTarget <= 0) {
        throw new BadRequestException('Nominal target tabungan harus bernilai positif.');
      }
      updates.target = numTarget;
    }

    if (dto.category !== undefined) {
      updates.category = dto.category.trim();
    }

    if (dto.targetDate !== undefined) {
      updates.targetDate = dto.targetDate;
    }

    if (dto.color !== undefined) {
      const validColors = ['emerald', 'blue', 'purple', 'amber', 'rose'];
      if (validColors.includes(dto.color.toLowerCase())) {
        updates.color = dto.color.toLowerCase();
      }
    }

    return this.firebaseService.updateGoal(userId, id, updates);
  }

  async remove(userId: string, id: string): Promise<{ success: boolean; message: string }> {
    const goal = await this.firebaseService.getGoalById(userId, id);
    if (!goal) {
      throw new NotFoundException(`Target tabungan dengan ID "${id}" tidak ditemukan.`);
    }

    // 1. Hapus transaksi terkait terlebih dahulu (Cascade Delete)
    await this.firebaseService.deleteTransactionsByGoalId(userId, id);

    // 2. Hapus target tabungan
    await this.firebaseService.deleteGoal(userId, id);

    return {
      success: true,
      message: `Target "${goal.title}" dan riwayat transaksi terkait berhasil dihapus.`,
    };
  }
}
