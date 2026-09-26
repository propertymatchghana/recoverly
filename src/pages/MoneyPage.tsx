import { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { formatCurrency, formatDate } from '@/lib/format';
import { SummaryCard } from '@/components/SummaryCard';
import { StatusBadge } from '@/components/Badges';
import { EmptyState } from '@/components/SummaryCard';
import { Wallet, AlertCircle, Clock, CheckCircle2, Search, MessageSquare, Eye } from 'lucide-react';

interface MoneyPageProps {
  onViewDetails: (id: string) => void;
  onGenerateMessage: (id: string) => void;
}

export function MoneyPage({ onViewDetails, onGenerateMessage }: MoneyPageProps) {
  const { state } = useApp();
  const [filter, setFilter] = useState<'all' | 'overdue' | 'due_soon' | 'paid'>('all');
  const [search, setSearch] = useState('');

  const invoiceRecords = useMemo(() => state.records.filter((r) => r.recordType === 'invoice'), [state.records]);

  const totalOutstanding = invoiceRecords
    .filter((r) => r.amount !== null && !['paid', 'completed', 'cancelled', 'settled'].some((s) => r.status.toLowerCase().includes(s)))
    .reduce((sum, r) => sum + (r.amount || 0), 0);

  const overdueAmount = state.analysis.filter((a) => a.category === 'overdue').reduce((sum, a) => sum + (a.amount || 0), 0);
  const upcomingAmount = state.analysis.filter((a) => a.category === 'due_soon').reduce((sum, a) => sum + (a.amount || 0), 0);
  const overdueCount = state.analysis.filter((a) => a.category === 'overdue').length;

  const filtered = useMemo(() => {
    let rows = invoiceRecords;
    if (filter === 'overdue') {
      rows = rows.filter((r) => state.analysis.some((a) => a.recordId === r.id && a.category === 'overdue'));
    } else if (filter === 'due_soon') {
      rows = rows.filter((r) => state.analysis.some((a) => a.recordId === r.id && a.category === 'due_soon'));
    } else if (filter === 'paid') {
      rows = rows.filter((r) => ['paid', 'completed', 'settled'].some((s) => r.status.toLowerCase().includes(s)));
    }
    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter((r) =>
        (r.customer || '').toLowerCase().includes(q) ||
        (r.reference || '').toLowerCase().includes(q)
      );
    }
    return rows;
  }, [invoiceRecords, filter, search, state.analysis]);

  if (state.records.length === 0) {
    return <EmptyState title="No data yet" message="Upload your Excel or CSV file to see your money overview." icon={<Wallet size={28} />} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Money</h1>
        <p className="mt-1 text-gray-500">Track outstanding payments, overdue invoices and upcoming deadlines.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard label="Total outstanding" value={formatCurrency(totalOutstanding, state.settings.currency)} icon={<Wallet size={20} />} accent="blue" />
        <SummaryCard label="Overdue amount" value={formatCurrency(overdueAmount, state.settings.currency)} icon={<AlertCircle size={20} />} accent="red" />
        <SummaryCard label="Upcoming amount" value={formatCurrency(upcomingAmount, state.settings.currency)} icon={<Clock size={20} />} accent="orange" />
        <SummaryCard label="Overdue records" value={overdueCount} icon={<AlertCircle size={20} />} accent="red" />
      </div>

      <div className="card p-5 sm:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-1 rounded-xl bg-gray-100 p-1">
            {(['all', 'overdue', 'due_soon', 'paid'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
                  filter === f ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {f === 'due_soon' ? 'Due soon' : f}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search customer or reference..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field py-2 pl-9 text-sm"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState title="No overdue payments" message="Great — no potentially overdue payments were identified in your current data." icon={<CheckCircle2 size={28} />} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-xs text-gray-500">
                  <th className="pb-3 pr-4 font-medium">Customer</th>
                  <th className="pb-3 pr-4 font-medium">Reference</th>
                  <th className="pb-3 pr-4 font-medium">Amount</th>
                  <th className="pb-3 pr-4 font-medium">Due date</th>
                  <th className="pb-3 pr-4 font-medium">Days overdue</th>
                  <th className="pb-3 pr-4 font-medium">Status</th>
                  <th className="pb-3 pr-4 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => {
                  const analysis = state.analysis.find((a) => a.recordId === r.id);
                  const daysOverdue = analysis?.daysOverdue ?? null;
                  return (
                    <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 pr-4 font-medium text-gray-900">{r.customer || '—'}</td>
                      <td className="py-3 pr-4 text-gray-600">{r.reference || '—'}</td>
                      <td className="py-3 pr-4 font-semibold text-gray-900">{formatCurrency(r.amount, state.settings.currency)}</td>
                      <td className="py-3 pr-4 text-gray-600">{formatDate(r.dueDate)}</td>
                      <td className="py-3 pr-4">
                        {daysOverdue !== null && daysOverdue > 0 ? (
                          <span className="font-medium text-red-600">{daysOverdue} days</span>
                        ) : daysOverdue !== null && daysOverdue < 0 ? (
                          <span className="text-gray-500">{Math.abs(daysOverdue)} days</span>
                        ) : '—'}
                      </td>
                      <td className="py-3 pr-4">{r.status ? <StatusBadge status={r.status} /> : '—'}</td>
                      <td className="py-3 pr-4">
                        <div className="flex gap-1">
                          <button onClick={() => onViewDetails(r.id)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700" title="View details">
                            <Eye size={16} />
                          </button>
                          <button onClick={() => onGenerateMessage(r.id)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700" title="Generate message">
                            <MessageSquare size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
