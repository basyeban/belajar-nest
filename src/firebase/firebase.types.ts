export type GoalColor = 'emerald' | 'blue' | 'purple' | 'amber' | 'rose';

export type TransactionType = 'deposit' | 'withdraw';

export interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
  category: string;
  targetDate: string;
  color: GoalColor | string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Transaction {
  id: string;
  goalId: string;
  goalTitle: string;
  type: TransactionType;
  amount: number;
  note?: string;
  date: string;
  createdAt?: string;
}

export interface DashboardStats {
  totalSavings: number;
  totalTarget: number;
  overallPercentage: number;
  activeGoalsCount: number;
  totalTransactionsCount: number;
  totalDeposited: number;
  totalWithdrawn: number;
}
