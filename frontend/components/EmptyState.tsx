'use client';

import React from 'react';
import { Target, Plus } from 'lucide-react';

interface EmptyStateProps {
  onAddClick: () => void;
}

export default function EmptyState({ onAddClick }: EmptyStateProps) {
  return (
    <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center my-6">
      <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
        <Target className="w-8 h-8 stroke-[1.8]" />
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-1">
        Belum Ada Target Tabungan
      </h3>
      <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
        Mulai wujudkan barang impian, liburan, atau dana daruratmu dengan menetapkan target pertamamu sekarang!
      </p>
      <button
        onClick={onAddClick}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-md shadow-emerald-600/20 transition active:scale-95"
      >
        <Plus className="w-4 h-4" />
        <span>Buat Target Pertama</span>
      </button>
    </div>
  );
}

