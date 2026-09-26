import { useApp } from '@/context/AppContext';
import { getSummaryStats } from '@/lib/analysis';
import { formatCurrency, formatDate } from '@/lib/format';
import { SummaryCard } from '@/components/SummaryCard';
import { PriorityBadge, CategoryBadge } from '@/components/Badges';
import { Wallet, TrendingUp, Users, AlertCircle, ArrowRight, MessageSquare, CheckCircle2, Database, UploadCloud } from 'lucide-react';
import type { AnalysisResult } from '@/types';

interface DashboardPageProps {
  onViewDetails: (id: string) => void;
  onGenerateMessage: (id: string) => void;
  onLoadDemo: () => void;
  onUpload: () => void;
}

export function DashboardPage({ onViewDetails, onGenerateMessage, onLoadDemo, onUpload }: DashboardPageProps) {
  const { state } = useApp();
  const stats = getSummaryStats(state.analysis);
  const userName = state.user?.name || 'Francis';

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  const activeActions = state.analysis.filter(
    (a) => !state.handledActions.includes(a.recordId) && !state.dismissedActions.includes(a.recordId)
  );

  if (state.records.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 sm:py-20">
        <div className="card w-full max-w-md p-8 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
            <Database size={32} />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">No business data yet</h2>
          <p className="mt-2 text-sm text-gray-500">
            Upload your Excel or CSV file, or use our fictional demo data to see how Recoverly works.
          </p>
          <div className="mt-6 flex flex-col gap-3">
            <button onClick={onLoadDemo} className="btn-primary w-full">
              <Database size={18} />
              Try Demo Data
            </button>
            <button onClick={onUpload} className="btn-secondary w-full">
              <UploadCloud size={18} />
              Upload Excel / CSV
            </button>
          </div>
          <p className="mt-4 text-xs text-gray-400">
            Demo data is fictional and contains no real customer information.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{greeting}, {userName}</h1>
        <p className="mt-1 text-gray-500">Here's what needs your attention today.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          label="Money needing attention"
          value={formatCurrency(stats.overdueAmount, state.settings.currency)}
          sublabel={`${stats.overdueCount} records · Potentially overdue`}
          icon={<Wallet size={20} />}
          accent="red"
        />
        <SummaryCard
          label="Sales opportunities"
          value={formatCurrency(stats.quotationAmount, state.settings.currency)}
          sublabel={`${stats.quotationCount} records · Quotations awaiting response`}
          icon={<TrendingUp size={20} />}
          accent="orange"
        />
        <SummaryCard
          label="Follow-ups"
          value={stats.inactiveCount}
          sublabel="Customers needing attention"
          icon={<Users size={20} />}
          accent="blue"
        />
        <SummaryCard
          label="High priority"
          value={stats.highPriorityCount}
          sublabel="Actions recommended today"
          icon={<AlertCircle size={20} />}
          accent="red"
        />
      </div>

      <div className="card p-5 sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Today's actions</h2>
          <span className="text-sm text-gray-400">{activeActions.length} actions</span>
        </div>

        {activeActions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-50 text-green-600">
              <CheckCircle2 size={28} />
            </div>
            <h3 className="text-base font-semibold text-gray-900">All caught up</h3>
            <p className="mt-1 text-sm text-gray-500">No actions remaining. Great work — everything has been handled.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {activeActions.slice(0, 10).map((action) => (
              <ActionRow
                key={action.recordId}
                action={action}
                currency={state.settings.currency}
                onView={() => onViewDetails(action.recordId)}
                onMessage={() => onGenerateMessage(action.recordId)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ActionRow({ action, currency, onView, onMessage }: {
  action: AnalysisResult;
  currency: string;
  onView: () => void;
  onMessage: () => void;
}) {
  const { record } = action;
  const typeLabel = record.recordType === 'invoice' ? `Invoice ${record.reference}` : record.recordType === 'quotation' ? `Quotation ${record.reference}` : record.reference || record.recordType;

  return (
    <div className="rounded-xl border border-gray-200 p-4 transition-colors hover:border-gray-300">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <PriorityBadge priority={action.priority} />
            <CategoryBadge category={action.category} />
          </div>
          <h3 className="mt-2 text-base font-semibold text-gray-900">{record.customer || 'Unknown customer'}</h3>
          <p className="text-sm text-gray-500">{typeLabel}</p>
          {action.amount !== null && (
            <p className="mt-1 text-lg font-bold text-gray-900">{formatCurrency(action.amount, currency)}</p>
          )}
          <p className="mt-1 text-sm text-gray-600">
            {action.category === 'overdue' && `Due ${action.daysOverdue} days ago`}
            {action.category === 'due_soon' && `Due in ${Math.abs(action.daysOverdue || 0)} days`}
            {action.category === 'quotation_followup' && `No response for ${action.daysSinceActivity ?? 'some'} days`}
            {action.category === 'customer_inactivity' && `Inactive for ${action.daysSinceActivity} days`}
            {action.category === 'missing_data' && 'Missing important information'}
          </p>
          <p className="mt-2 text-sm text-gray-500">
            <span className="font-medium text-gray-700">Recommended:</span> {action.recommendedAction}
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button onClick={onView} className="btn-secondary text-xs">View details</button>
          <button onClick={onMessage} className="btn-primary text-xs">
            <MessageSquare size={14} />
            Generate message
          </button>
        </div>
      </div>
    </div>
  );
}
