'use client';

import React, { useState, useEffect } from 'react';
import { X, ArrowDownRight, ArrowUpRight, AlertCircle } from 'lucide-react';
import { Goal, TransactionType, formatRupiah } from '../lib/types';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  goals: Goal[];
  selectedGoalId?: string;
  onSubmit: (data: {
    goalId: string;
    type: TransactionType;
    amount: number;
    note?: string;
  }) => Promise<void>;
}

const QUICK_AMOUNTS = [50000, 100000, 250000, 500000, 1000000];

export default function TransactionModal({
  isOpen,
  onClose,
  goals,
  selectedGoalId,
  onSubmit,
}: TransactionModalProps) {
  const [goalId, setGoalId] = useState<string>('');
  const [type, setType] = useState<TransactionType>('deposit');
  const [amount, setAmount] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedGoalId) {
      setGoalId(selectedGoalId);
    } else if (goals.length > 0 && !goalId) {
      setGoalId(goals[0].id);
    }
  }, [selectedGoalId, goals, isOpen]);

  if (!isOpen) return null;

  const currentGoal = goals.find((g) => g.id === goalId);
  const currentBalance = currentGoal?.current || 0;
  const numAmount = Number(amount) || 0;
  const isWithdrawExceeded = type === 'withdraw' && numAmount > currentBalance;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!goalId) {
      setError('Silakan pilih target tabungan.');
      return;
    }

    if (numAmount <= 0) {
      setError('Nominal transaksi harus lebih dari 0.');
      return;
    }

    if (isWithdrawExceeded) {
      setError(
        `Saldo saat ini (${formatRupiah(currentBalance)}) tidak mencukupi untuk menarik ${formatRupiah(numAmount)}.`
      );
      return;
    }

    try {
      setLoading(true);
      await onSubmit({
        goalId,
        type,
        amount: numAmount,
        note: note.trim() || undefined,
      });
      // Reset & Close
      setAmount('');
      setNote('');
      setType('deposit');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Gagal memproses transaksi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">
            Catat Mutasi Tabungan
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Type Selector (Menabung vs Tarik Dana) */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Jenis Transaksi
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl">
              <button
                type="button"
                onClick={() => setType('deposit')}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  type === 'deposit'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ArrowUpRight className="w-4 h-4" />
                <span>Menabung (Setor)</span>
              </button>
              <button
                type="button"
                onClick={() => setType('withdraw')}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  type === 'withdraw'
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/25'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ArrowDownRight className="w-4 h-4" />
                <span>Tarik Dana</span>
              </button>
            </div>
          </div>

          {/* Pilih Target Tabungan */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Target Tabungan
            </label>
            <select
              value={goalId}
              onChange={(e) => setGoalId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm bg-white"
            >
              {goals.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.title} (Saldo: {formatRupiah(g.current)})
                </option>
              ))}
            </select>
            {currentGoal && (
              <div className="mt-1.5 flex items-center justify-between text-xs text-slate-500 px-1">
                <span>Saldo saat ini:</span>
                <span className="font-bold text-slate-800">
                  {formatRupiah(currentGoal.current)}
                </span>
              </div>
            )}
          </div>

          {/* Input Nominal */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Nominal Transaksi (Rp)
            </label>
            <input
              type="number"
              placeholder="Cth: 250000"
              min="1000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 ${
                isWithdrawExceeded
                  ? 'border-rose-400 focus:ring-rose-500 bg-rose-50/30'
                  : 'border-slate-200 focus:ring-emerald-500'
              }`}
              required
            />
            {isWithdrawExceeded && (
              <p className="mt-1 text-xs text-rose-600 font-medium">
                ⚠️ Nominal penarikan melebihi saldo tabungan saat ini!
              </p>
            )}

            {/* Quick Amount Pills */}
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {QUICK_AMOUNTS.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setAmount(String(amt))}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition"
                >
                  +{amt >= 1000000 ? `${amt / 1000000} Jt` : `${amt / 1000} Rb`}
                </button>
              ))}
            </div>
          </div>

          {/* Catatan Transaksi */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Catatan (Opsional)
            </label>
            <input
              type="text"
              placeholder={
                type === 'deposit'
                  ? 'Cth: Bonus lembur project, sisa uang jajan'
                  : 'Cth: Keperluan mendadak'
              }
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            />
          </div>

          {/* Submit */}
          <div className="pt-4 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading || isWithdrawExceeded}
              className={`px-5 py-2.5 rounded-xl text-white text-sm font-semibold shadow-md transition active:scale-95 disabled:opacity-50 ${
                type === 'deposit'
                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                  : 'bg-rose-600 hover:bg-rose-700 shadow-rose-600/20'
              }`}
            >
              {loading
                ? 'Menyimpan...'
                : type === 'deposit'
                ? 'Setor Sekarang'
                : 'Tarik Saldo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

