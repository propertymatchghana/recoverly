import { useApp } from '@/context/AppContext';
import { getSummaryStats } from '@/lib/analysis';
import { CheckCircle2, ArrowRight, AlertCircle, Clock, Users, FileWarning } from 'lucide-react';

interface AnalysisResultsPageProps {
  onContinue: () => void;
}

export function AnalysisResultsPage({ onContinue }: AnalysisResultsPageProps) {
  const { state } = useApp();
  const stats = getSummaryStats(state.analysis);
  const totalRecords = state.records.length;

  const items = [
    { icon: <AlertCircle size={20} />, label: 'Potentially overdue', count: stats.overdueCount, color: 'text-red-600 bg-red-50' },
    { icon: <Clock size={20} />, label: 'Quotations needing follow-up', count: stats.quotationCount, color: 'text-orange-600 bg-orange-50' },
    { icon: <Users size={20} />, label: 'Customers needing attention', count: stats.inactiveCount, color: 'text-orange-600 bg-orange-50' },
    { icon: <FileWarning size={20} />, label: 'Records with missing information', count: state.analysis.filter(a => a.category === 'missing_data').length, color: 'text-gray-600 bg-gray-100' },
  ];

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 text-green-600">
          <CheckCircle2 size={32} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Analysis complete</h1>
        <p className="mt-1 text-gray-500">{totalRecords} records analyzed</p>
      </div>

      <div className="card p-5 sm:p-6">
        <div className="space-y-3">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl border border-gray-200 p-4">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.color}`}>{item.icon}</div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700">{item.label}</p>
              </div>
              <p className="text-xl font-bold text-gray-900">{item.count}</p>
            </div>
          ))}
        </div>
      </div>

      <button onClick={onContinue} className="btn-primary w-full">
        View dashboard
        <ArrowRight size={18} />
      </button>
    </div>
  );
}
