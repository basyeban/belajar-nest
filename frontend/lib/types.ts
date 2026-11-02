export type GoalColor = 'emerald' | 'blue' | 'purple' | 'amber' | 'rose';

export type TransactionType = 'deposit' | 'withdraw';

export interface User {
  id: string;
  username: string;
  name: string;
  email?: string;
  createdAt?: string;
}

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
  totalDeposited?: number;
  totalWithdrawn?: number;
}

export const formatRupiah = (value: number | string): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};

export const calculateProgress = (current: number, target: number): number => {
  if (!target || target <= 0) return 0;
  const pct = Math.round((current / target) * 100);
  return Math.min(100, Math.max(0, pct));
};

export const getColorTheme = (color: string) => {
  const c = (color || 'emerald').toLowerCase();
  switch (c) {
    case 'blue':
      return {
        name: 'Blue',
        border: 'border-blue-200 dark:border-blue-900',
        bg: 'bg-blue-50/70 dark:bg-blue-950/30',
        badge: 'bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300',
        progress: 'bg-blue-500',
        progressTrack: 'bg-blue-100 dark:bg-blue-950',
        accentText: 'text-blue-600 dark:text-blue-400',
        ring: 'focus:ring-blue-500',
        button: 'bg-blue-600 hover:bg-blue-700 text-white',
      };
    case 'purple':
      return {
        name: 'Purple',
        border: 'border-purple-200 dark:border-purple-900',
        bg: 'bg-purple-50/70 dark:bg-purple-950/30',
        badge: 'bg-purple-100 text-purple-800 dark:bg-purple-900/60 dark:text-purple-300',
        progress: 'bg-purple-500',
        progressTrack: 'bg-purple-100 dark:bg-purple-950',
        accentText: 'text-purple-600 dark:text-purple-400',
        ring: 'focus:ring-purple-500',
        button: 'bg-purple-600 hover:bg-purple-700 text-white',
      };
    case 'amber':
      return {
        name: 'Amber',
        border: 'border-amber-200 dark:border-amber-900',
        bg: 'bg-amber-50/70 dark:bg-amber-950/30',
        badge: 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300',
        progress: 'bg-amber-500',
        progressTrack: 'bg-amber-100 dark:bg-amber-950',
        accentText: 'text-amber-600 dark:text-amber-400',
        ring: 'focus:ring-amber-500',
        button: 'bg-amber-600 hover:bg-amber-700 text-white',
      };
    case 'rose':
      return {
        name: 'Rose',
        border: 'border-rose-200 dark:border-rose-900',
        bg: 'bg-rose-50/70 dark:bg-rose-950/30',
        badge: 'bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300',
        progress: 'bg-rose-500',
        progressTrack: 'bg-rose-100 dark:bg-rose-950',
        accentText: 'text-rose-600 dark:text-rose-400',
        ring: 'focus:ring-rose-500',
        button: 'bg-rose-600 hover:bg-rose-700 text-white',
      };
    case 'emerald':
    default:
      return {
        name: 'Emerald',
        border: 'border-emerald-200 dark:border-emerald-900',
        bg: 'bg-emerald-50/70 dark:bg-emerald-950/30',
        badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300',
        progress: 'bg-emerald-500',
        progressTrack: 'bg-emerald-100 dark:bg-emerald-950',
        accentText: 'text-emerald-600 dark:text-emerald-400',
        ring: 'focus:ring-emerald-500',
        button: 'bg-emerald-600 hover:bg-emerald-700 text-white',
      };
  }
};
