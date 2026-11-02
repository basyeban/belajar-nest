'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import SummaryCards from '../components/SummaryCards';
import GoalCard from '../components/GoalCard';
import AddGoalModal from '../components/AddGoalModal';
import EditGoalModal from '../components/EditGoalModal';
import TransactionModal from '../components/TransactionModal';
import TransactionHistory from '../components/TransactionHistory';
import EmptyState from '../components/EmptyState';
import LoginForm from '../components/LoginForm';
import {
  Goal,
  Transaction,
  DashboardStats,
  GoalColor,
  TransactionType,
  User,
} from '../lib/types';
import {
  getGoals,
  getTransactions,
  getDashboardStats,
  createGoal,
  updateGoal,
  deleteGoal,
  createTransaction,
  getCurrentUser,
  logout,
  resetAllData,
} from '../lib/api';
import { RefreshCw, RotateCcw } from 'lucide-react';

export default function CelenganKuPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const [goals, setGoals] = useState<Goal[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalSavings: 0,
    totalTarget: 0,
    overallPercentage: 0,
    activeGoalsCount: 0,
    totalTransactionsCount: 0,
    totalDeposited: 0,
    totalWithdrawn: 0,
  });

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('Semua');

  // Modals
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
  const [isEditGoalOpen, setIsEditGoalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [isTransactionOpen, setIsTransactionOpen] = useState(false);
  const [selectedGoalIdForTx, setSelectedGoalIdForTx] = useState<string | undefined>(undefined);

  // Toast / Notification
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Check login on client mount
  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
    setIsCheckingAuth(false);
  }, []);

  const loadData = useCallback(async (silent = false) => {
    try {
      if (!silent) setIsRefreshing(true);
      const [fetchedGoals, fetchedTransactions, fetchedStats] = await Promise.all([
        getGoals(),
        getTransactions(),
        getDashboardStats(),
      ]);

      setGoals(fetchedGoals);
      setTransactions(fetchedTransactions);

      const totalSavings = fetchedGoals.reduce((sum, g) => sum + (Number(g.current) || 0), 0);
      const totalTarget = fetchedGoals.reduce((sum, g) => sum + (Number(g.target) || 0), 0);
      const overallPercentage = totalTarget > 0 ? Math.min(100, Math.round((totalSavings / totalTarget) * 100)) : 0;

      const totalDeposited = fetchedTransactions
        .filter((tx) => tx.type === 'deposit')
        .reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);

      const totalWithdrawn = fetchedTransactions
        .filter((tx) => tx.type === 'withdraw')
        .reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);

      setStats({
        totalSavings,
        totalTarget,
        overallPercentage,
        activeGoalsCount: fetchedGoals.length,
        totalTransactionsCount: fetchedTransactions.length,
        totalDeposited,
        totalWithdrawn,
      });
    } catch (err: any) {
      console.error('Error loading data:', err);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  // Sync data when user is logged in
  useEffect(() => {
    if (!currentUser) return;

    loadData();
    const interval = setInterval(() => {
      loadData(true);
    }, 4000);
    return () => clearInterval(interval);
  }, [currentUser, loadData]);

  // Auth Handlers
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    showNotification('success', `Selamat datang, ${user.name || user.username}! 👋`);
  };

  const handleLogout = () => {
    logout();
    setCurrentUser(null);
    setGoals([]);
    setTransactions([]);
  };

  // Add Goal
  const handleAddGoal = async (data: {
    title: string;
    target: number;
    category: string;
    targetDate: string;
    color: GoalColor;
    current: number;
  }) => {
    await createGoal(data);
    showNotification('success', `Target "${data.title}" berhasil dibuat! 🎯`);
    await loadData(false);
  };

  // Open Edit Goal Modal
  const handleOpenEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setIsEditGoalOpen(true);
  };

  // Submit Edit Goal
  const handleUpdateGoal = async (
    id: string,
    data: {
      title: string;
      target: number;
      category: string;
      targetDate: string;
      color: GoalColor;
    },
  ) => {
    await updateGoal(id, data);
    showNotification('success', `Target "${data.title}" berhasil diperbarui! ✏️`);
    await loadData(false);
  };

  // Delete Goal
  const handleDeleteGoal = async (goalId: string, goalTitle: string) => {
    const confirmed = window.confirm(
      `Apakah Anda yakin ingin menghapus target "${goalTitle}"?\nSeluruh riwayat mutasi terkait target ini juga akan dihapus.`
    );
    if (!confirmed) return;

    try {
      await deleteGoal(goalId);
      showNotification('success', `Target "${goalTitle}" berhasil dihapus.`);
      await loadData(false);
    } catch (err: any) {
      showNotification('error', err.message || 'Gagal menghapus target');
    }
  };

  // Quick Deposit
  const handleQuickDeposit = (goal: Goal) => {
    setSelectedGoalIdForTx(goal.id);
    setIsTransactionOpen(true);
  };

  // Generic Transaction
  const handleOpenTransaction = () => {
    setSelectedGoalIdForTx(undefined);
    setIsTransactionOpen(true);
  };

  // Submit Transaction
  const handleTransactionSubmit = async (data: {
    goalId: string;
    type: TransactionType;
    amount: number;
    note?: string;
  }) => {
    await createTransaction(data);
    const actionText = data.type === 'deposit' ? 'Setoran berhasil dicatat' : 'Penarikan berhasil dicatat';
    showNotification('success', `${actionText}! 💰`);
    await loadData(false);
  };

  // Reset Data
  const handleResetData = async () => {
    const confirmed = window.confirm(
      'Apakah Anda yakin ingin mengosongkan seluruh data celengan dan mutasi akun ini?'
    );
    if (!confirmed) return;

    try {
      await resetAllData();
      showNotification('success', 'Seluruh data berhasil dikosongkan.');
      await loadData(false);
    } catch (err: any) {
      showNotification('error', err.message || 'Gagal mengosongkan data');
    }
  };

  // Loading Auth check
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // If not logged in, display the Login / Register form!
  if (!currentUser) {
    return <LoginForm onLoginSuccess={handleLoginSuccess} />;
  }

  // Filter Categories
  const categories = ['Semua', ...Array.from(new Set(goals.map((g) => g.category)))];
  const filteredGoals =
    activeCategory === 'Semua'
      ? goals
      : goals.filter((g) => g.category === activeCategory);

  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-900 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        user={currentUser}
        onLogout={handleLogout}
        onOpenAddGoal={() => setIsAddGoalOpen(true)}
        onOpenTransaction={handleOpenTransaction}
      />

      {/* Floating Notification */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 animate-bounce">
          <div
            className={`px-4 py-3 rounded-2xl shadow-xl border text-sm font-semibold flex items-center gap-2 ${
              notification.type === 'success'
                ? 'bg-emerald-600 text-white border-emerald-500'
                : 'bg-rose-600 text-white border-rose-500'
            }`}
          >
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Dashboard Cards */}
        <SummaryCards stats={stats} />

        {/* Goals Section */}
        <section className="mb-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Daftar Celengan & Target
              </h2>
              <p className="text-xs text-slate-500">
                Pilih atau pantau progres setiap impian Anda
              </p>
            </div>

            {/* Category Filter Pills, Refresh & Reset */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 p-1 bg-white rounded-xl border border-slate-200 text-xs">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1 rounded-lg font-semibold transition ${
                      activeCategory === cat
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <button
                onClick={() => loadData(false)}
                disabled={isRefreshing}
                className="p-2 bg-white rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 transition disabled:opacity-50"
                title="Refresh Realtime Data"
              >
                <RefreshCw
                  className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`}
                />
              </button>

              <button
                onClick={handleResetData}
                className="p-2 bg-white rounded-xl border border-slate-200 text-slate-400 hover:text-rose-600 transition"
                title="Kosongkan Semua Data Celengan"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Goals Grid */}
          {filteredGoals.length === 0 ? (
            <EmptyState onAddClick={() => setIsAddGoalOpen(true)} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredGoals.map((goal) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  onDepositClick={handleQuickDeposit}
                  onEditClick={handleOpenEditGoal}
                  onDeleteClick={handleDeleteGoal}
                />
              ))}
            </div>
          )}
        </section>

        {/* Transactions Ledger Section */}
        <section>
          <TransactionHistory transactions={transactions} />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-400">
        <p>CelenganKu &copy; 2026 &bull; Dibuat dengan Next.js, Nest.js & Firebase Realtime Database</p>
      </footer>

      {/* Modals */}
      <AddGoalModal
        isOpen={isAddGoalOpen}
        onClose={() => setIsAddGoalOpen(false)}
        onSubmit={handleAddGoal}
      />

      <EditGoalModal
        isOpen={isEditGoalOpen}
        onClose={() => {
          setIsEditGoalOpen(false);
          setEditingGoal(null);
        }}
        goal={editingGoal}
        onSubmit={handleUpdateGoal}
      />

      <TransactionModal
        isOpen={isTransactionOpen}
        onClose={() => setIsTransactionOpen(false)}
        goals={goals}
        selectedGoalId={selectedGoalIdForTx}
        onSubmit={handleTransactionSubmit}
      />
    </div>
  );
}
