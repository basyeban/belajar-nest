'use client';

import React from 'react';
import { Calendar, Trash2, Edit3, ArrowUpRight, CheckCircle2, TrendingUp, Sparkles, AlertTriangle } from 'lucide-react';
import { Goal, formatRupiah, calculateProgress, getColorTheme } from '../lib/types';

interface GoalCardProps {
  goal: Goal;
  onDepositClick: (goal: Goal) => void;
  onEditClick: (goal: Goal) => void;
  onDeleteClick: (goalId: string, goalTitle: string) => void;
}

export default function GoalCard({
  goal,
  onDepositClick,
  onEditClick,
  onDeleteClick,
}: GoalCardProps) {
  const theme = getColorTheme(goal.color);
  const progress = calculateProgress(goal.current, goal.target);
  const remaining = Math.max(0, goal.target - goal.current);
  const isCompleted = goal.current >= goal.target;

  // Kalkulator Rencana Menabung (Smart Savings Planner)
  let daysLeft = 0;
  let isOverdue = false;
  let dailyRecommendation = 0;
  let monthlyRecommendation = 0;

  if (goal.targetDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadline = new Date(goal.targetDate);
    deadline.setHours(0, 0, 0, 0);
    const diffTime = deadline.getTime() - today.getTime();
    daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (daysLeft < 0) {
      isOverdue = true;
    } else if (daysLeft > 0 && remaining > 0) {
      dailyRecommendation = Math.ceil(remaining / daysLeft);
      const monthsLeft = daysLeft / 30;
      monthlyRecommendation = Math.ceil(remaining / (monthsLeft < 1 ? 1 : monthsLeft));
    }
  }

  return (
    <div
      className={`rounded-2xl p-5 border ${theme.border} ${theme.bg} shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between relative group`}
    >
      <div>
        {/* Top Header: Category & Action Buttons */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${theme.badge}`}
          >
            {goal.category}
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onEditClick(goal)}
              className="p-1.5 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-white/80 transition"
              title="Edit Target"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDeleteClick(goal.id, goal.title)}
              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-white/80 transition"
              title="Hapus Target"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-slate-900 line-clamp-1 mb-1">
          {goal.title}
        </h3>

        {/* Deadline & Status */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{goal.targetDate || 'Tanpa batas'}</span>
          </div>
          {goal.targetDate && (
            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                isCompleted
                  ? 'bg-emerald-100 text-emerald-800'
                  : isOverdue
                  ? 'bg-rose-100 text-rose-700'
                  : daysLeft <= 14
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {isCompleted
                ? 'Selesai'
                : isOverdue
                ? 'Lewat Deadline'
                : `${daysLeft} hari lagi`}
            </span>
          )}
        </div>

        {/* Balances */}
        <div className="space-y-1 mb-3">
          <div className="flex items-baseline justify-between">
            <span className="text-xs text-slate-500">Terkumpul:</span>
            <span className="text-lg font-black text-slate-900">
              {formatRupiah(goal.current)}
            </span>
          </div>
          <div className="flex items-baseline justify-between text-xs text-slate-500">
            <span>Target:</span>
            <span className="font-semibold text-slate-700">
              {formatRupiah(goal.target)}
            </span>
          </div>
          <div className="flex items-baseline justify-between text-xs text-slate-500">
            <span>Sisa:</span>
            <span className="font-medium text-slate-600">
              {formatRupiah(remaining)}
            </span>
          </div>
        </div>

        {/* Progress Bar & Percentage */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
            <span className="text-slate-600">Progres Ketercapaian</span>
            <span className={theme.accentText}>{progress}%</span>
          </div>
          <div className={`w-full ${theme.progressTrack} h-2.5 rounded-full overflow-hidden`}>
            <div
              className={`h-full ${theme.progress} rounded-full transition-all duration-500`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Smart Savings Recommendation Pill */}
        {!isCompleted && !isOverdue && dailyRecommendation > 0 && (
          <div className="mb-4 p-2.5 rounded-xl bg-white/70 border border-slate-200/60 flex items-start gap-2 text-xs">
            <TrendingUp className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-[11px] text-slate-600 leading-tight">
              <span>Rekomendasi: </span>
              <span className="font-bold text-slate-800">
                {formatRupiah(dailyRecommendation)}/hari
              </span>{' '}
              atau{' '}
              <span className="font-semibold text-slate-700">
                {formatRupiah(monthlyRecommendation)}/bulan
              </span>
            </div>
          </div>
        )}

        {!isCompleted && isOverdue && (
          <div className="mb-4 p-2 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-1.5 text-xs text-rose-700">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span className="text-[11px]">Tenggat waktu terlewat. Anda dapat mengedit deadline target.</span>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between gap-2">
        {isCompleted ? (
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 py-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Target Tercapai! 🎉</span>
          </div>
        ) : (
          <div className="text-[11px] text-slate-500">
            {remaining > 0 ? `Kurang ${formatRupiah(remaining)}` : ''}
          </div>
        )}

        <button
          onClick={() => onDepositClick(goal)}
          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold ${theme.button} shadow-sm transition active:scale-95`}
        >
          <span>Isi Saldo</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
