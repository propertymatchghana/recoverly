import { useApp } from '@/context/AppContext';
import { formatCurrency, formatDate, daysBetween } from '@/lib/format';
import { PriorityBadge, CategoryBadge, StatusBadge } from '@/components/Badges';
import { ArrowLeft, MessageSquare, CheckCircle2, XCircle, Phone, Mail, Calendar, AlertCircle } from 'lucide-react';

interface ActionDetailsPageProps {
  recordId: string;
  onBack: () => void;
  onGenerateMessage: () => void;
}

export function ActionDetailsPage({ recordId, onBack, onGenerateMessage }: ActionDetailsPageProps) {
  const { state, markHandled, dismissAction } = useApp();
  const action = state.analysis.find((a) => a.recordId === recordId);

  if (!action) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-500">Action not found.</p>
        <button onClick={onBack} className="btn-secondary mt-4">Go back</button>
      </div>
    );
  }

  const { record } = action;
  const isHandled = state.handledActions.includes(recordId);
  const isDismissed = state.dismissedActions.includes(recordId);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <button onClick={onBack} className="btn-ghost -ml-2">
        <ArrowLeft size={18} />
        Back
      </button>

      <div className="card p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <PriorityBadge priority={action.priority} />
          <CategoryBadge category={action.category} />
          {record.status && <StatusBadge status={record.status} />}
          {isHandled && <span className="inline-flex items-center gap-1 rounded-full border border-green-200 bg-green-50 px-2.5 py-0.5 text-xs font-semibold text-green-700"><CheckCircle2 size={12} /> Handled</span>}
          {isDismissed && <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-100 px-2.5 py-0.5 text-xs font-semibold text-gray-600"><XCircle size={12} /> Dismissed</span>}
        </div>

        <h1 className="mt-3 text-2xl font-bold text-gray-900">{record.customer || 'Unknown customer'}</h1>
        <p className="text-gray-500">
          {record.recordType === 'invoice' ? 'Invoice' : record.recordType === 'quotation' ? 'Quotation' : 'Record'}
          {record.reference ? ` ${record.reference}` : ''}
        </p>

        {action.amount !== null && (
          <p className="mt-2 text-3xl font-bold text-gray-900">{formatCurrency(action.amount, state.settings.currency)}</p>
        )}

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {record.dueDate && (
            <InfoRow icon={<Calendar size={16} />} label="Due date" value={formatDate(record.dueDate)} />
          )}
          {action.daysOverdue !== null && action.daysOverdue > 0 && (
            <InfoRow icon={<AlertCircle size={16} />} label="Days overdue" value={`${action.daysOverdue} days`} />
          )}
          {record.date && (
            <InfoRow icon={<Calendar size={16} />} label="Date" value={formatDate(record.date)} />
          )}
          {action.daysSinceActivity !== null && (
            <InfoRow icon={<Calendar size={16} />} label="Days since activity" value={`${action.daysSinceActivity} days`} />
          )}
          {record.phone && (
            <InfoRow icon={<Phone size={16} />} label="Phone" value={record.phone} />
          )}
          {record.email && (
            <InfoRow icon={<Mail size={16} />} label="Email" value={record.email} />
          )}
        </div>
      </div>

      <div className="card p-5 sm:p-6">
        <h2 className="text-base font-semibold text-gray-900">Why this needs attention</h2>
        <p className="mt-2 text-sm text-gray-600">{action.reason}</p>
      </div>

      <div className="card p-5 sm:p-6">
        <h2 className="text-base font-semibold text-gray-900">Recommended action</h2>
        <p className="mt-2 text-sm font-medium text-gray-700">{action.recommendedAction}</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button onClick={onGenerateMessage} className="btn-primary flex-1">
          <MessageSquare size={18} />
          Generate message
        </button>
        {!isHandled && (
          <button onClick={() => markHandled(recordId)} className="btn-secondary flex-1">
            <CheckCircle2 size={18} />
            Mark as handled
          </button>
        )}
        {!isDismissed && (
          <button onClick={() => { dismissAction(recordId); onBack(); }} className="btn-secondary flex-1">
            <XCircle size={18} />
            Dismiss
          </button>
        )}
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-gray-200 p-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100 text-gray-500">{icon}</div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-sm font-medium text-gray-900">{value}</p>
      </div>
    </div>
  );
}
