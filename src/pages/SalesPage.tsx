import { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { formatCurrency, formatDate, daysBetween } from '@/lib/format';
import { SummaryCard } from '@/components/SummaryCard';
import { StatusBadge } from '@/components/Badges';
import { EmptyState } from '@/components/SummaryCard';
import { TrendingUp, Clock, AlertCircle, Target, Search, MessageSquare, Eye } from 'lucide-react';

interface SalesPageProps {
  onViewDetails: (id: string) => void;
  onGenerateMessage: (id: string) => void;
}

export function SalesPage({ onViewDetails, onGenerateMessage }: SalesPageProps) {
  const { state } = useApp();
  const [search, setSearch] = useState('');

  const quotations = useMemo(() => state.records.filter((r) => r.recordType === 'quotation'), [state.records]);

  const totalQuotationValue = quotations.reduce((sum, r) => sum + (r.amount || 0), 0);
  const openQuotations = quotations.filter((r) => {
    const s = r.status.toLowerCase();
    return !s.includes('closed') && !s.includes('rejected') && !s.includes('lost');
  }).length;
  const awaitingResponse = state.analysis.filter((a) => a.category === 'quotation_followup').length;
  const highValue = quotations.filter((r) => (r.amount || 0) >= 10000).length;

  const filtered = useMemo(() => {
    if (!search) return quotations;
    const q = search.toLowerCase();
    return quotations.filter((r) =>
      (r.customer || '').toLowerCase().includes(q) ||
      (r.reference || '').toLowerCase().includes(q)
    );
  }, [quotations, search]);

  if (state.records.length === 0) {
    return <EmptyState title="No data yet" message="Upload your Excel or CSV file to see your sales opportunities." icon={<TrendingUp size={28} />} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Sales</h1>
        <p className="mt-1 text-gray-500">Track quotations, follow-ups and high-value opportunities.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard label="Total quotation value" value={formatCurrency(totalQuotationValue, state.settings.currency)} icon={<TrendingUp size={20} />} accent="blue" />
        <SummaryCard label="Open quotations" value={openQuotations} icon={<Clock size={20} />} accent="orange" />
        <SummaryCard label="Awaiting response" value={awaitingResponse} icon={<AlertCircle size={20} />} accent="orange" />
        <SummaryCard label="High-value opportunities" value={highValue} icon={<Target size={20} />} accent="green" />
      </div>

      <div className="card p-5 sm:p-6">
        <div className="mb-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search customer or quotation..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field py-2 pl-9 text-sm"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState title="No quotations found" message="No quotations match your search. Try a different term." icon={<TrendingUp size={28} />} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-xs text-gray-500">
                  <th className="pb-3 pr-4 font-medium">Customer</th>
                  <th className="pb-3 pr-4 font-medium">Quotation</th>
                  <th className="pb-3 pr-4 font-medium">Amount</th>
                  <th className="pb-3 pr-4 font-medium">Date</th>
                  <th className="pb-3 pr-4 font-medium">Last activity</th>
                  <th className="pb-3 pr-4 font-medium">Status</th>
                  <th className="pb-3 pr-4 font-medium">Recommended action</th>
                  <th className="pb-3 pr-4 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => {
                  const analysis = state.analysis.find((a) => a.recordId === r.id);
                  const daysSince = r.lastContact ? daysBetween(r.lastContact) : (r.date ? daysBetween(r.date) : null);
                  let recommended = 'No action needed';
                  if (analysis?.category === 'quotation_followup') recommended = 'Follow up on quotation';
                  else if (daysSince !== null && daysSince < 3) recommended = 'Recent — monitor';
                  return (
                    <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 pr-4 font-medium text-gray-900">{r.customer || '—'}</td>
                      <td className="py-3 pr-4 text-gray-600">{r.reference || '—'}</td>
                      <td className="py-3 pr-4 font-semibold text-gray-900">{formatCurrency(r.amount, state.settings.currency)}</td>
                      <td className="py-3 pr-4 text-gray-600">{formatDate(r.date)}</td>
                      <td className="py-3 pr-4 text-gray-600">
                        {daysSince !== null ? `${daysSince} days ago` : '—'}
                      </td>
                      <td className="py-3 pr-4">{r.status ? <StatusBadge status={r.status} /> : '—'}</td>
                      <td className="py-3 pr-4 text-xs text-gray-500">{recommended}</td>
                      <td className="py-3 pr-4">
                        <div className="flex gap-1">
                          <button onClick={() => onViewDetails(r.id)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700">
                            <Eye size={16} />
                          </button>
                          <button onClick={() => onGenerateMessage(r.id)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700">
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
