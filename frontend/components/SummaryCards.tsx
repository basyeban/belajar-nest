'use client';

import React from 'react';
import { Wallet, Target, Percent, Layers, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { DashboardStats, formatRupiah } from '../lib/types';

interface SummaryCardsProps {
  stats: DashboardStats;
}

export default function SummaryCards({ stats }: SummaryCardsProps) {
  const percentage = Math.min(100, Math.max(0, stats.overallPercentage || 0));
  const totalDeposited = stats.totalDeposited || 0;
  const totalWithdrawn = stats.totalWithdrawn || 0;

  return (
    <div className="space-y-4 mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Total Saldo Terkumpul */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Terkumpul
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {formatRupiah(stats.totalSavings)}
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Akumulasi seluruh celengan aktif
          </p>
        </div>

        {/* 2. Akumulasi Target Keseluruhan */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Target
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
              <Target className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {formatRupiah(stats.totalTarget)}
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Nominal gabungan seluruh impian
          </p>
        </div>

        {/* 3. Persentase Progress Keseluruhan */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Progress Capaian
            </span>
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600">
              <Percent className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-black text-slate-900 tracking-tight">
              {percentage}%
            </div>
            <span className="text-xs font-medium text-slate-500">
              {percentage >= 100 ? 'Target Tercapai 🎉' : 'Sedang Berjalan'}
            </span>
          </div>
          {/* Visual Progress Bar */}
          <div className="mt-2.5 w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* 4. Arus Kas Mutasi (Inflow vs Outflow) */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Arus Kas Tabungan
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1 text-emerald-600 font-medium">
                <ArrowUpRight className="w-3.5 h-3.5" /> Masuk:
              </span>
              <span className="font-bold text-slate-800">
                {formatRupiah(totalDeposited)}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1 text-rose-600 font-medium">
                <ArrowDownRight className="w-3.5 h-3.5" /> Keluar:
              </span>
              <span className="font-bold text-slate-800">
                {formatRupiah(totalWithdrawn)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
