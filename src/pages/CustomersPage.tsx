import { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { formatDate, daysBetween } from '@/lib/format';
import { SummaryCard } from '@/components/SummaryCard';
import { PriorityBadge } from '@/components/Badges';
import { EmptyState } from '@/components/SummaryCard';
import { Users, UserCheck, UserX, AlertCircle, Search, MessageSquare, Eye, Phone, Mail } from 'lucide-react';

interface CustomersPageProps {
  onViewDetails: (id: string) => void;
  onGenerateMessage: (id: string) => void;
}

export function CustomersPage({ onViewDetails, onGenerateMessage }: CustomersPageProps) {
  const { state } = useApp();
  const [search, setSearch] = useState('');

  // Get unique customers by name
  const customers = useMemo(() => {
    const map = new Map<string, { name: string; phone: string; email: string; lastContact: string | null; id: string }>();
    for (const r of state.records) {
      if (!r.customer) continue;
      const existing = map.get(r.customer);
      const lastContact = r.lastContact || r.date || null;
      if (!existing || (lastContact && (!existing.lastContact || (existing.lastContact && lastContact > existing.lastContact)))) {
        map.set(r.customer, {
          name: r.customer,
          phone: r.phone,
          email: r.email,
          lastContact,
          id: r.id,
        });
      }
    }
    return Array.from(map.values());
  }, [state.records]);

  const totalCustomers = customers.length;
  const activeCustomers = customers.filter((c) => {
    if (!c.lastContact) return false;
    const days = daysBetween(c.lastContact);
    return days !== null && days <= 30;
  }).length;
  const inactiveCustomers = totalCustomers - activeCustomers;
  const needingFollowUp = state.analysis.filter((a) => a.category === 'customer_inactivity').length;

  const filtered = useMemo(() => {
    if (!search) return customers;
    const q = search.toLowerCase();
    return customers.filter((c) =>
      c.name.toLowerCase().includes(q) ||
      c.phone.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q)
    );
  }, [customers, search]);

  if (state.records.length === 0) {
    return <EmptyState title="No data yet" message="Upload your Excel or CSV file to see your customers." icon={<Users size={28} />} />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
        <p className="mt-1 text-gray-500">Monitor customer activity and identify who needs follow-up.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard label="Total customers" value={totalCustomers} icon={<Users size={20} />} accent="blue" />
        <SummaryCard label="Active customers" value={activeCustomers} icon={<UserCheck size={20} />} accent="green" />
        <SummaryCard label="Inactive customers" value={inactiveCustomers} icon={<UserX size={20} />} accent="orange" />
        <SummaryCard label="Needing follow-up" value={needingFollowUp} icon={<AlertCircle size={20} />} accent="orange" />
      </div>

      <div className="card p-5 sm:p-6">
        <div className="mb-4">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, phone or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field py-2 pl-9 text-sm"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState title="No customers found" message="No customers match your search." icon={<Users size={28} />} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-xs text-gray-500">
                  <th className="pb-3 pr-4 font-medium">Customer</th>
                  <th className="pb-3 pr-4 font-medium">Phone</th>
                  <th className="pb-3 pr-4 font-medium">Email</th>
                  <th className="pb-3 pr-4 font-medium">Last contact</th>
                  <th className="pb-3 pr-4 font-medium">Days inactive</th>
                  <th className="pb-3 pr-4 font-medium">Priority</th>
                  <th className="pb-3 pr-4 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => {
                  const days = c.lastContact ? daysBetween(c.lastContact) : null;
                  const analysis = state.analysis.find((a) => a.record.customer === c.name && a.category === 'customer_inactivity');
                  const priority = days !== null && days > 45 ? 'high' : days !== null && days > 30 ? 'medium' : 'low';
                  return (
                    <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 pr-4 font-medium text-gray-900">{c.name}</td>
                      <td className="py-3 pr-4">
                        {c.phone ? (
                          <span className="flex items-center gap-1 text-gray-600"><Phone size={13} />{c.phone}</span>
                        ) : '—'}
                      </td>
                      <td className="py-3 pr-4">
                        {c.email ? (
                          <span className="flex items-center gap-1 text-gray-600"><Mail size={13} />{c.email}</span>
                        ) : '—'}
                      </td>
                      <td className="py-3 pr-4 text-gray-600">{formatDate(c.lastContact)}</td>
                      <td className="py-3 pr-4">
                        {days !== null ? (
                          <span className={days > 30 ? 'font-medium text-orange-600' : 'text-gray-500'}>{days} days</span>
                        ) : '—'}
                      </td>
                      <td className="py-3 pr-4">
                        {analysis ? <PriorityBadge priority={priority} /> : <span className="text-xs text-gray-400">Healthy</span>}
                      </td>
                      <td className="py-3 pr-4">
                        <div className="flex gap-1">
                          <button onClick={() => onViewDetails(c.id)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700">
                            <Eye size={16} />
                          </button>
                          <button onClick={() => onGenerateMessage(c.id)} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700">
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
