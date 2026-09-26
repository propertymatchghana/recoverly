import type { ReactNode } from 'react';

interface SummaryCardProps {
  label: string;
  value: string | number;
  sublabel?: string;
  icon?: ReactNode;
  accent?: 'red' | 'orange' | 'blue' | 'green' | 'gray';
}

export function SummaryCard({ label, value, sublabel, icon, accent = 'gray' }: SummaryCardProps) {
  const accents: Record<string, string> = {
    red: 'text-red-600 bg-red-50',
    orange: 'text-orange-600 bg-orange-50',
    blue: 'text-brand-600 bg-brand-50',
    green: 'text-green-600 bg-green-50',
    gray: 'text-gray-600 bg-gray-100',
  };
  return (
    <div className="card p-5 animate-slide-up">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
          {sublabel && <p className="mt-1 text-sm text-gray-500">{sublabel}</p>}
        </div>
        {icon && (
          <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${accents[accent]}`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

interface EmptyStateProps {
  title: string;
  message: string;
  icon?: ReactNode;
}

export function EmptyState({ title, message, icon }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon && <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-gray-400">{icon}</div>}
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-gray-500">{message}</p>
    </div>
  );
}
