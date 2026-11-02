import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Goal, Transaction, DashboardStats } from './firebase.types.js';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private readonly logger = new Logger(FirebaseService.name);
  private databaseUrl: string | null = null;
  private databaseAuth: string | null = null;

  // In-memory storage - dimulai dalam keadaan KOSONG (clean slate)
  private inMemoryGoals: Map<string, Map<string, Goal>> = new Map();
  private inMemoryTransactions: Map<string, Map<string, Transaction>> = new Map();

  onModuleInit() {
    const rawUrl = process.env.FIREBASE_DATABASE_URL?.trim();
    this.databaseAuth = process.env.FIREBASE_DATABASE_AUTH?.trim() || null;

    if (rawUrl && rawUrl.startsWith('http')) {
      // Normalize URL by removing trailing slash
      this.databaseUrl = rawUrl.replace(/\/+$/, '');
      this.logger.log(`[FirebaseService] Connected to Firebase Realtime Database at: ${this.databaseUrl}`);
    } else {
      this.logger.log(
        `[FirebaseService] Running in clean in-memory mode (semua data dimulai dari KOSONG).`
      );
    }
  }

  private buildFirebaseUrl(path: string): string {
    const authQuery = this.databaseAuth ? `?auth=${encodeURIComponent(this.databaseAuth)}` : '';
    return `${this.databaseUrl}/${path}.json${authQuery}`;
  }

  // ==========================================
  // RESET / KOSONGKAN DATA
  // ==========================================

  async clearAllData(userId: string): Promise<{ success: boolean; message: string }> {
    if (this.databaseUrl) {
      const goalsUrl = this.buildFirebaseUrl(`users/${userId}/goals`);
      const txUrl = this.buildFirebaseUrl(`users/${userId}/transactions`);
      await Promise.all([
        fetch(goalsUrl, { method: 'DELETE' }),
        fetch(txUrl, { method: 'DELETE' }),
      ]);
    } else {
      this.inMemoryGoals.delete(userId);
      this.inMemoryTransactions.delete(userId);
    }

    this.logger.log(`[FirebaseService] Seluruh data untuk user "${userId}" telah dikosongkan.`);
    return {
      success: true,
      message: `Seluruh data celengan dan mutasi berhasil dikosongkan.`,
    };
  }

  // ==========================================
  // GOALS METHODS
  // ==========================================

  async getGoals(userId: string): Promise<Goal[]> {
    if (this.databaseUrl) {
      const url = this.buildFirebaseUrl(`users/${userId}/goals`);
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Failed to fetch goals from Firebase: ${res.statusText}`);
      }
      const data = await res.json();
      if (!data) return [];

      return Object.entries(data).map(([id, item]: [string, any]) => ({
        ...item,
        id,
      }));
    }

    const userGoals = this.inMemoryGoals.get(userId);
    if (!userGoals) return [];
    return Array.from(userGoals.values());
  }

  async getGoalById(userId: string, id: string): Promise<Goal | null> {
    if (this.databaseUrl) {
      const url = this.buildFirebaseUrl(`users/${userId}/goals/${id}`);
      const res = await fetch(url);
      if (!res.ok) return null;
      const data = await res.json();
      if (!data) return null;
      return { ...data, id };
    }

    const userGoals = this.inMemoryGoals.get(userId);
    return userGoals?.get(id) ?? null;
  }

  async createGoal(userId: string, data: Omit<Goal, 'id'>): Promise<Goal> {
    const now = new Date().toISOString();
    const goalPayload = {
      ...data,
      current: data.current ?? 0,
      createdAt: now,
      updatedAt: now,
    };

    if (this.databaseUrl) {
      const url = this.buildFirebaseUrl(`users/${userId}/goals`);
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(goalPayload),
      });

      if (!res.ok) {
        throw new Error(`Failed to create goal in Firebase: ${res.statusText}`);
      }

      const result = await res.json();
      const generatedId = result.name;
      return {
        ...goalPayload,
        id: generatedId,
      };
    }

    if (!this.inMemoryGoals.has(userId)) {
      this.inMemoryGoals.set(userId, new Map());
    }

    const id = `goal_${Date.now()}`;
    const newGoal: Goal = {
      ...goalPayload,
      id,
    };

    this.inMemoryGoals.get(userId)!.set(id, newGoal);
    return newGoal;
  }

  async updateGoal(userId: string, id: string, partial: Partial<Goal>): Promise<Goal> {
    const now = new Date().toISOString();
    const updatePayload = {
      ...partial,
      updatedAt: now,
    };

    if (this.databaseUrl) {
      const url = this.buildFirebaseUrl(`users/${userId}/goals/${id}`);
      const res = await fetch(url, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatePayload),
      });

      if (!res.ok) {
        throw new Error(`Failed to update goal in Firebase: ${res.statusText}`);
      }

      const updated = await this.getGoalById(userId, id);
      if (!updated) throw new Error('Goal not found after update');
      return updated;
    }

    const userGoals = this.inMemoryGoals.get(userId);
    const existing = userGoals?.get(id);
    if (!existing) {
      throw new Error(`Goal with ID "${id}" not found.`);
    }

    const updatedGoal: Goal = {
      ...existing,
      ...updatePayload,
      id,
    };

    userGoals!.set(id, updatedGoal);
    return updatedGoal;
  }

  async deleteGoal(userId: string, id: string): Promise<boolean> {
    if (this.databaseUrl) {
      const url = this.buildFirebaseUrl(`users/${userId}/goals/${id}`);
      const res = await fetch(url, { method: 'DELETE' });
      if (!res.ok) {
        throw new Error(`Failed to delete goal from Firebase: ${res.statusText}`);
      }
      return true;
    }

    const userGoals = this.inMemoryGoals.get(userId);
    if (!userGoals || !userGoals.has(id)) {
      return false;
    }
    userGoals.delete(id);
    return true;
  }

  // ==========================================
  // TRANSACTIONS METHODS
  // ==========================================

  async getTransactions(userId: string, goalId?: string): Promise<Transaction[]> {
    let list: Transaction[] = [];

    if (this.databaseUrl) {
      const url = this.buildFirebaseUrl(`users/${userId}/transactions`);
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Failed to fetch transactions from Firebase: ${res.statusText}`);
      }
      const data = await res.json();
      if (data) {
        list = Object.entries(data).map(([id, item]: [string, any]) => ({
          ...item,
          id,
        }));
      }
    } else {
      const userTx = this.inMemoryTransactions.get(userId);
      if (userTx) {
        list = Array.from(userTx.values());
      }
    }

    if (goalId) {
      list = list.filter((tx) => tx.goalId === goalId);
    }

    // Sort chronologically descending (newest first)
    return list.sort((a, b) => {
      const timeA = new Date(a.date || a.createdAt || 0).getTime();
      const timeB = new Date(b.date || b.createdAt || 0).getTime();
      return timeB - timeA;
    });
  }

  async createTransaction(userId: string, data: Omit<Transaction, 'id'>): Promise<Transaction> {
    const now = new Date().toISOString();
    const txPayload = {
      ...data,
      createdAt: now,
    };

    if (this.databaseUrl) {
      const url = this.buildFirebaseUrl(`users/${userId}/transactions`);
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(txPayload),
      });

      if (!res.ok) {
        throw new Error(`Failed to record transaction in Firebase: ${res.statusText}`);
      }

      const result = await res.json();
      return {
        ...txPayload,
        id: result.name,
      };
    }

    if (!this.inMemoryTransactions.has(userId)) {
      this.inMemoryTransactions.set(userId, new Map());
    }

    const id = `tx_${Date.now()}`;
    const newTx: Transaction = {
      ...txPayload,
      id,
    };

    this.inMemoryTransactions.get(userId)!.set(id, newTx);
    return newTx;
  }

  async deleteTransactionsByGoalId(userId: string, goalId: string): Promise<void> {
    const transactions = await this.getTransactions(userId, goalId);

    if (this.databaseUrl) {
      for (const tx of transactions) {
        const url = this.buildFirebaseUrl(`users/${userId}/transactions/${tx.id}`);
        await fetch(url, { method: 'DELETE' });
      }
    } else {
      const userTx = this.inMemoryTransactions.get(userId);
      if (userTx) {
        for (const tx of transactions) {
          userTx.delete(tx.id);
        }
      }
    }
  }

  // ==========================================
  // DASHBOARD STATISTICS
  // ==========================================

  async getDashboardStats(userId: string): Promise<DashboardStats> {
    const goals = await this.getGoals(userId);
    const transactions = await this.getTransactions(userId);

    const totalSavings = goals.reduce((sum, g) => sum + (Number(g.current) || 0), 0);
    const totalTarget = goals.reduce((sum, g) => sum + (Number(g.target) || 0), 0);
    const overallPercentage = totalTarget > 0 ? Math.min(100, Math.round((totalSavings / totalTarget) * 100)) : 0;

    const totalDeposited = transactions
      .filter((tx) => tx.type === 'deposit')
      .reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);

    const totalWithdrawn = transactions
      .filter((tx) => tx.type === 'withdraw')
      .reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);

    return {
      totalSavings,
      totalTarget,
      overallPercentage,
      activeGoalsCount: goals.length,
      totalTransactionsCount: transactions.length,
      totalDeposited,
      totalWithdrawn,
    };
  }
}
