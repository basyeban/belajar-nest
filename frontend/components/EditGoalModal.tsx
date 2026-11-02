'use client';

import React, { useState, useEffect } from 'react';
import { X, Edit3 } from 'lucide-react';
import { Goal, GoalColor } from '../lib/types';

interface EditGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: Goal | null;
  onSubmit: (id: string, data: {
    title: string;
    target: number;
    category: string;
    targetDate: string;
    color: GoalColor;
  }) => Promise<void>;
}

const CATEGORIES = [
  'Gadget & Elektronik',
  'Liburan & Travelling',
  'Kendaraan & Transportasi',
  'Dana Darurat',
  'Pendidikan',
  'Rumah & Properti',
  'Lainnya',
];

const COLORS: { key: GoalColor; label: string; class: string }[] = [
  { key: 'emerald', label: 'Emerald', class: 'bg-emerald-500' },
  { key: 'blue', label: 'Blue', class: 'bg-blue-500' },
  { key: 'purple', label: 'Purple', class: 'bg-purple-500' },
  { key: 'amber', label: 'Amber', class: 'bg-amber-500' },
  { key: 'rose', label: 'Rose', class: 'bg-rose-500' },
];

export default function EditGoalModal({
  isOpen,
  onClose,
  goal,
  onSubmit,
}: EditGoalModalProps) {
  const [title, setTitle] = useState('');
  const [target, setTarget] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [targetDate, setTargetDate] = useState('');
  const [color, setColor] = useState<GoalColor>('emerald');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (goal) {
      setTitle(goal.title);
      setTarget(String(goal.target));
      setCategory(goal.category || CATEGORIES[0]);
      setTargetDate(goal.targetDate || '');
      setColor((goal.color as GoalColor) || 'emerald');
      setError(null);
    }
  }, [goal, isOpen]);

  if (!isOpen || !goal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const targetNum = Number(target);

    if (!title.trim()) {
      setError('Nama target / impian wajib diisi.');
      return;
    }

    if (isNaN(targetNum) || targetNum <= 0) {
      setError('Nominal target harus berupa angka lebih besar dari 0.');
      return;
    }

    if (!targetDate) {
      setError('Tenggat waktu (deadline) wajib diisi.');
      return;
    }

    try {
      setLoading(true);
      await onSubmit(goal.id, {
        title: title.trim(),
        target: targetNum,
        category,
        targetDate,
        color,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || 'Gagal memperbarui target tabungan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <Edit3 className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              Edit Target Tabungan
            </h2>
          </div>
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
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {error}
            </div>
          )}

          {/* Nama Target */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Nama Impian / Target <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              required
            />
          </div>

          {/* Nominal Target */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Target Dana (Rp) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              min="1000"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              required
            />
            <p className="mt-1 text-[11px] text-slate-400">
              Saldo saat ini: Rp {goal.current.toLocaleString('id-ID')} (tidak berubah)
            </p>
          </div>

          {/* Kategori & Tenggat Waktu */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Kategori
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Tenggat Waktu <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
                required
              />
            </div>
          </div>

          {/* Kustomisasi Warna Kartu */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
              Warna Kartu Target
            </label>
            <div className="flex items-center gap-3">
              {COLORS.map((c) => (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => setColor(c.key)}
                  className={`w-9 h-9 rounded-xl ${c.class} transition-all flex items-center justify-center ${
                    color === c.key
                      ? 'ring-4 ring-slate-900/20 scale-110 shadow-md'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                  title={c.label}
                >
                  {color === c.key && (
                    <span className="w-2.5 h-2.5 rounded-full bg-white shadow"></span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
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
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md shadow-blue-600/20 transition active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Menyimpan...' : 'Perbarui Target'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

