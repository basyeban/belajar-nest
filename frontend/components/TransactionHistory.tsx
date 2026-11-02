'use client';

import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Clock, Receipt, Download, Search, Filter } from 'lucide-react';
import { Transaction, formatRupiah } from '../lib/types';

interface TransactionHistoryProps {
  transactions: Transaction[];
}

export default function TransactionHistory({
  transactions,
}: TransactionHistoryProps) {
  const [filterType, setFilterType] = useState<'all' | 'deposit' | 'withdraw'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtered transactions
  const filtered = transactions.filter((tx) => {
    const matchesType =
      filterType === 'all' ? true : tx.type === filterType;
    const matchesSearch =
      searchQuery.trim() === ''
        ? true
        : tx.goalTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (tx.note && tx.note.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesType && matchesSearch;
  });

  // Ekspor ke CSV
  const handleExportCSV = () => {
    if (transactions.length === 0) return;

    const headers = ['ID Transaksi', 'Tanggal', 'Tipe', 'Target Impian', 'Nominal (IDR)', 'Catatan'];
    const rows = filtered.map((tx) => [
      `"${tx.id}"`,
      `"${tx.date}"`,
      `"${tx.type === 'deposit' ? 'Setoran (Menabung)' : 'Penarikan Dana'}"`,
      `"${tx.goalTitle.replace(/"/g, '""')}"`,
      tx.amount,
      `"${(tx.note || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `mutasi-celenganku-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-8 text-center">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
          <Receipt className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-bold text-slate-800">Belum Ada Riwayat Transaksi</h4>
        <p className="text-xs text-slate-500 mt-1">
          Lakukan transaksi setoran atau penarikan untuk mencatat mutasi di sini.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
      {/* Header with Title & Export */}
      <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-500" />
          <h3 className="text-sm font-bold text-slate-800">
            Riwayat Transaksi & Mutasi
          </h3>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
            {filtered.length} dari {transactions.length} mutasi
          </span>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-sm transition active:scale-95"
          title="Unduh laporan mutasi dalam format CSV (Excel)"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span>Ekspor CSV</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari impian atau catatan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 bg-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-slate-400"
          />
        </div>

        {/* Type Filter Buttons */}
        <div className="flex items-center gap-1 w-full sm:w-auto p-1 bg-white rounded-xl border border-slate-200 text-xs">
          <button
            onClick={() => setFilterType('all')}
            className={`flex-1 sm:flex-initial px-3 py-1 rounded-lg font-semibold transition ${
              filterType === 'all'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setFilterType('deposit')}
            className={`flex-1 sm:flex-initial px-3 py-1 rounded-lg font-semibold transition ${
              filterType === 'deposit'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Setoran (+)
          </button>
          <button
            onClick={() => setFilterType('withdraw')}
            className={`flex-1 sm:flex-initial px-3 py-1 rounded-lg font-semibold transition ${
              filterType === 'withdraw'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Penarikan (-)
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-semibold uppercase tracking-wider">
              <th className="py-3 px-6">Tipe & Tanggal</th>
              <th className="py-3 px-6">Target Tabungan</th>
              <th className="py-3 px-6">Catatan</th>
              <th className="py-3 px-6 text-right">Nominal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-slate-400">
                  Tidak ada transaksi yang cocok dengan filter atau pencarian.
                </td>
              </tr>
            ) : (
              filtered.map((tx) => {
                const isDeposit = tx.type === 'deposit';
                return (
                  <tr
                    key={tx.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    {/* Tipe & Tanggal */}
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                            isDeposit
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-rose-100 text-rose-700'
                          }`}
                        >
                          {isDeposit ? (
                            <ArrowUpRight className="w-4 h-4" />
                          ) : (
                            <ArrowDownRight className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">
                            {isDeposit ? 'Menabung' : 'Tarik Saldo'}
                          </p>
                          <p className="text-[11px] text-slate-400">{tx.date}</p>
                        </div>
                      </div>
                    </td>

                    {/* Target Tabungan */}
                    <td className="py-3.5 px-6">
                      <span className="font-semibold text-slate-800">
                        {tx.goalTitle}
                      </span>
                    </td>

                    {/* Catatan */}
                    <td className="py-3.5 px-6">
                      <span className="text-slate-500 italic">
                        {tx.note || '-'}
                      </span>
                    </td>

                    {/* Nominal */}
                    <td className="py-3.5 px-6 text-right">
                      <span
                        className={`font-black text-sm ${
                          isDeposit ? 'text-emerald-600' : 'text-rose-600'
                        }`}
                      >
                        {isDeposit ? '+' : '-'} {formatRupiah(tx.amount)}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
