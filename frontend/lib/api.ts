import { Goal, Transaction, DashboardStats, User } from './types';

// Di browser → relative '/api' sehingga Next.js rewrite proxy yang forward ke backend
// Di server-side (build) → gunakan URL backend langsung
const API_BASE_URL =
  typeof window !== 'undefined'
    ? '/api'
    : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export function getActiveUserId(): string {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('celenganku_user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed?.id) return parsed.id;
      } catch (e) {
        // ignore
      }
    }
  }
  return process.env.NEXT_PUBLIC_USER_ID || 'user_id_123';
}

export function getCurrentUser(): User | null {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('celenganku_user');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return null;
      }
    }
  }
  return null;
}

export function setCurrentUser(user: User): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('celenganku_user', JSON.stringify(user));
  }
}

export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('celenganku_user');
    localStorage.removeItem('celenganku_token');
  }
}

function getHeaders() {
  return {
    'Content-Type': 'application/json',
    'x-user-id': getActiveUserId(),
  };
}

// ==========================================
// AUTH API
// ==========================================

export async function loginApi(
  username: string,
  password: string,
): Promise<{ user: User; token: string }> {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(
      Array.isArray(json.message)
        ? json.message.join(', ')
        : json.message || 'Login gagal',
    );
  }

  const { user, token } = json.data;
  if (typeof window !== 'undefined') {
    localStorage.setItem('celenganku_user', JSON.stringify(user));
    localStorage.setItem('celenganku_token', token);
  }

  return { user, token };
}

export async function registerApi(
  username: string,
  password: string,
  name?: string,
  email?: string,
): Promise<{ user: User; token: string }> {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, name, email }),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(
      Array.isArray(json.message)
        ? json.message.join(', ')
        : json.message || 'Pendaftaran gagal',
    );
  }

  const { user, token } = json.data;
  if (typeof window !== 'undefined') {
    localStorage.setItem('celenganku_user', JSON.stringify(user));
    localStorage.setItem('celenganku_token', token);
  }

  return { user, token };
}

// ==========================================
// DASHBOARD & DATA API
// ==========================================

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const res = await fetch(`${API_BASE_URL}/dashboard/stats`, {
      headers: getHeaders(),
      cache: 'no-store',
    });
    if (!res.ok) throw new Error('Gagal mengambil data statistik');
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.warn('[API] Backend stats unreachable, using fallback:', error);
    return {
      totalSavings: 0,
      totalTarget: 0,
      overallPercentage: 0,
      activeGoalsCount: 0,
      totalTransactionsCount: 0,
    };
  }
}

export async function getGoals(): Promise<Goal[]> {
  const res = await fetch(`${API_BASE_URL}/goals`, {
    headers: getHeaders(),
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error('Gagal memuat target tabungan');
  }
  const json = await res.json();
  return json.data || [];
}

export async function createGoal(payload: {
  title: string;
  target: number;
  category: string;
  targetDate: string;
  color?: string;
  current?: number;
}): Promise<Goal> {
  const res = await fetch(`${API_BASE_URL}/goals`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(
      Array.isArray(json.message)
        ? json.message.join(', ')
        : json.message || 'Gagal membuat target tabungan',
    );
  }
  return json.data;
}

export async function updateGoal(
  id: string,
  payload: {
    title?: string;
    target?: number;
    category?: string;
    targetDate?: string;
    color?: string;
  },
): Promise<Goal> {
  const res = await fetch(`${API_BASE_URL}/goals/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(
      Array.isArray(json.message)
        ? json.message.join(', ')
        : json.message || 'Gagal memperbarui target tabungan',
    );
  }
  return json.data;
}

export async function deleteGoal(id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/goals/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });

  if (!res.ok) {
    const json = await res.json();
    throw new Error(json.message || 'Gagal menghapus target');
  }
}

export async function getTransactions(goalId?: string): Promise<Transaction[]> {
  const query = goalId ? `?goalId=${encodeURIComponent(goalId)}` : '';
  const res = await fetch(`${API_BASE_URL}/transactions${query}`, {
    headers: getHeaders(),
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Gagal memuat riwayat transaksi');
  }
  const json = await res.json();
  return json.data || [];
}

export async function createTransaction(payload: {
  goalId: string;
  type: 'deposit' | 'withdraw';
  amount: number;
  note?: string;
  date?: string;
}): Promise<{ transaction: Transaction; updatedGoal: Goal }> {
  const res = await fetch(`${API_BASE_URL}/transactions`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(
      Array.isArray(json.message)
        ? json.message.join(', ')
        : json.message || 'Gagal menyimpan transaksi',
    );
  }
  return json.data;
}

export async function resetAllData(): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/dashboard/reset`, {
    method: 'POST',
    headers: getHeaders(),
  });
  if (!res.ok) {
    throw new Error('Gagal mengosongkan data');
  }
}
