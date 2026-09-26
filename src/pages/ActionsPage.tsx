import { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { formatCurrency } from '@/lib/format';
import { PriorityBadge, CategoryBadge } from '@/components/Badges';
import { EmptyState } from '@/components/SummaryCard';
import { ListChecks, Search, Eye, MessageSquare, CheckCircle2 } from 'lucide-react';
import type { Priority, ActionCategory } from '@/types';

interface ActionsPageProps {
  onViewDetails: (id: string) => void;
  onGenerateMessage: (id: string) => void;
}

export function ActionsPage({ onViewDetails, onGenerateMessage }: ActionsPageProps) {
  const { state } = useApp();
  const [search, setSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<'all' | Priority>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | ActionCategory>('all');

  const activeActions = useMemo(() => {
    return state.analysis.filter(
      (a) => !state.handledActions.includes(a.recordId) && !state.dismissedActions.includes(a.recordId)
    );
  }, [state.analysis, state.handledActions, state.dismissedActions]);

  const filtered = useMemo(() => {
    let rows = activeActions;
    if (priorityFilter !== 'all') rows = rows.filter((a) => a.priority === priorityFilter);
    if (typeFilter !== 'all') rows = rows.filter((a) => a.category === typeFilter);
    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter((a) =>
        (a.record.customer || '').toLowerCase().includes(q) ||
        (a.record.reference || '').toLowerCase().includes(q) ||
        (a.record.phone || '').toLowerCase().includes(q) ||
        (a.record.email || '').toLowerCase().includes(q)
      );
    }
    return rows;
  }, [activeActions, priorityFilter, typeFilter, search]);

  if (state.records.length === 0) {
    return <EmptyState title="No data yet" message="Upload your Excel or CSV file to see actions." icon={<ListChecks size={28} />} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Actions</h1>
        <p className="mt-1 text-gray-500">All records that need attention, sorted by priority.</p>
      </div>

      <div className="card p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by customer, reference, phone or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field py-2 pl-9 text-sm"
            />
          </div>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as 'all' | Priority)}
            className="select-field py-2 text-sm sm:w-40"
          >
            <option value="all">All priorities</option>
            <option value="high">High priority</option>
            <option value="medium">Medium priority</option>
            <option value="low">Low priority</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as 'all' | ActionCategory)}
            className="select-field py-2 text-sm sm:w-44"
          >
            <option value="all">All types</option>
            <option value="overdue">Overdue</option>
            <option value="due_soon">Due soon</option>
            <option value="quotation_followup">Quotation follow-up</option>
            <option value="customer_inactivity">Customer inactivity</option>
            <option value="missing_data">Missing data</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No actions found" message="No actions match your current filters. Try adjusting your search or filters." icon={<CheckCircle2 size={28} />} />
      ) : (
        <div className="space-y-3">
          {filtered.map((action) => (
            <div key={action.recordId} className="card p-4 transition-colors hover:border-gray-300">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <PriorityBadge priority={action.priority} />
                    <CategoryBadge category={action.category} />
                  </div>
                  <h3 className="mt-2 font-semibold text-gray-900">{action.record.customer || 'Unknown customer'}</h3>
                  <p className="text-sm text-gray-500">
                    {action.record.recordType === 'invoice' ? 'Invoice' : action.record.recordType === 'quotation' ? 'Quotation' : 'Record'}
                    {action.record.reference ? ` ${action.record.reference}` : ''}
                    {action.amount !== null && ` · ${formatCurrency(action.amount, state.settings.currency)}`}
                  </p>
                  <p className="mt-1 text-sm text-gray-600">{action.reason}</p>
                  <p className="mt-1 text-sm font-medium text-brand-700">{action.recommendedAction}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button onClick={() => onViewDetails(action.recordId)} className="btn-secondary text-xs">
                    <Eye size={14} /> View
                  </button>
                  <button onClick={() => onGenerateMessage(action.recordId)} className="btn-primary text-xs">
                    <MessageSquare size={14} /> Message
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
