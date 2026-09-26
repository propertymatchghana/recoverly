import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { CURRENCIES } from '@/lib/format';
import { Settings as SettingsIcon, Building2, DollarSign, MessageSquare, Trash2, CheckCircle2 } from 'lucide-react';

export function SettingsPage() {
  const { state, updateSettings, clearData } = useApp();
  const [businessName, setBusinessName] = useState(state.settings.businessName);
  const [currency, setCurrency] = useState(state.settings.currency);
  const [tone, setTone] = useState(state.settings.followUpTone);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateSettings({ businessName, currency, followUpTone: tone });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-gray-500">Configure your business preferences.</p>
      </div>

      <div className="card p-5 sm:p-6">
        <div className="mb-4 flex items-center gap-2">
          <Building2 size={18} className="text-gray-400" />
          <h2 className="text-base font-semibold text-gray-900">Business</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Business name</label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="input-field"
            />
          </div>
        </div>
      </div>

      <div className="card p-5 sm:p-6">
        <div className="mb-4 flex items-center gap-2">
          <DollarSign size={18} className="text-gray-400" />
          <h2 className="text-base font-semibold text-gray-900">Currency</h2>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Display currency</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="select-field"
          >
            {Object.entries(CURRENCIES).map(([code, { label }]) => (
              <option key={code} value={code}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="card p-5 sm:p-6">
        <div className="mb-4 flex items-center gap-2">
          <MessageSquare size={18} className="text-gray-400" />
          <h2 className="text-base font-semibold text-gray-900">Follow-up tone</h2>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Default message tone</label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value as 'professional' | 'friendly')}
            className="select-field"
          >
            <option value="professional">Professional</option>
            <option value="friendly">Friendly</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={handleSave} className="btn-primary">
          Save settings
        </button>
        {saved && (
          <span className="flex items-center gap-1 text-sm text-green-600">
            <CheckCircle2 size={16} /> Saved
          </span>
        )}
      </div>

      <div className="card border-red-200 p-5 sm:p-6">
        <div className="mb-3 flex items-center gap-2">
          <Trash2 size={18} className="text-red-500" />
          <h2 className="text-base font-semibold text-gray-900">Clear all data</h2>
        </div>
        <p className="mb-4 text-sm text-gray-500">Remove all uploaded data, analysis results and settings from this browser. This cannot be undone.</p>
        <button
          onClick={() => { if (confirm('Clear all data? This cannot be undone.')) clearData(); }}
          className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 transition-colors hover:bg-red-100"
        >
          <Trash2 size={16} />
          Clear all data
        </button>
      </div>

      <div className="rounded-xl bg-gray-50 px-4 py-3 text-xs text-gray-500">
        Your uploaded data stays in this browser in Version 1. Nothing is sent to any external server.
      </div>
    </div>
  );
}
