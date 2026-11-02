'use client';

import React from 'react';
import { PiggyBank, Plus, ArrowLeftRight, LogOut, User as UserIcon } from 'lucide-react';
import { User } from '../lib/types';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
  onOpenAddGoal: () => void;
  onOpenTransaction: () => void;
}

export default function Header({
  user,
  onLogout,
  onOpenAddGoal,
  onOpenTransaction,
}: HeaderProps) {
  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-30 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white">
              <PiggyBank className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black tracking-tight text-slate-900">
                  Celengan<span className="text-emerald-600">Ku</span>
                </h1>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Realtime
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Wujudkan impian finansial dengan menabung disiplin & terarah
              </p>
            </div>
          </div>

          {/* User Profile & Actions */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
            {user && (
              <div className="flex items-center gap-2 py-1 px-3 bg-slate-100 rounded-xl">
                <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs font-bold uppercase">
                  {user.name ? user.name[0] : user.username[0]}
                </div>
                <div className="text-left hidden md:block">
                  <p className="text-xs font-bold text-slate-800 line-clamp-1">
                    {user.name || user.username}
                  </p>
                  <p className="text-[10px] text-slate-400">@{user.username}</p>
                </div>
                <button
                  onClick={onLogout}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-white transition"
                  title="Keluar dari akun"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}

            <button
              onClick={onOpenTransaction}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold shadow-sm transition active:scale-95"
            >
              <ArrowLeftRight className="w-4 h-4 text-slate-500" />
              <span>Transaksi</span>
            </button>
            <button
              onClick={onOpenAddGoal}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-md shadow-emerald-600/25 transition active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Tambah Target</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
