import type { Priority, ActionCategory } from '@/types';

export function PriorityBadge({ priority }: { priority: Priority }) {
  const styles: Record<Priority, string> = {
    high: 'bg-red-50 text-red-700 border-red-200',
    medium: 'bg-orange-50 text-orange-700 border-orange-200',
    low: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${styles[priority]}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${priority === 'high' ? 'bg-red-500' : priority === 'medium' ? 'bg-orange-500' : 'bg-yellow-500'}`} />
      {priority.charAt(0).toUpperCase() + priority.slice(1)} priority
    </span>
  );
}

export function CategoryBadge({ category }: { category: ActionCategory }) {
  const labels: Record<ActionCategory, { text: string; class: string }> = {
    overdue: { text: 'Potentially overdue', class: 'bg-red-50 text-red-700 border-red-200' },
    due_soon: { text: 'Due soon', class: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
    quotation_followup: { text: 'Follow-up needed', class: 'bg-orange-50 text-orange-700 border-orange-200' },
    customer_inactivity: { text: 'May need follow-up', class: 'bg-orange-50 text-orange-700 border-orange-200' },
    missing_data: { text: 'Missing data', class: 'bg-gray-100 text-gray-600 border-gray-200' },
    healthy: { text: 'Healthy', class: 'bg-green-50 text-green-700 border-green-200' },
  };
  const s = labels[category];
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${s.class}`}>
      {s.text}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const s = status.toLowerCase();
  let cls = 'bg-gray-100 text-gray-600 border-gray-200';
  if (s.includes('paid') || s.includes('completed') || s.includes('closed') || s.includes('settled')) {
    cls = 'bg-green-50 text-green-700 border-green-200';
  } else if (s.includes('await') || s.includes('pending') || s.includes('open') || s.includes('sent')) {
    cls = 'bg-orange-50 text-orange-700 border-orange-200';
  } else if (s.includes('unpaid') || s.includes('overdue')) {
    cls = 'bg-red-50 text-red-700 border-red-200';
  }
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${cls}`}>
      {status || 'Unknown'}
    </span>
  );
}
