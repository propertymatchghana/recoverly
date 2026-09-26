import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { generateMessage, type MessageChannel, type MessageTone } from '@/lib/messages';
import { ArrowLeft, Copy, RefreshCw, Check, MessageSquare, Mail } from 'lucide-react';

interface MessageGeneratorPageProps {
  recordId: string;
  onBack: () => void;
}

export function MessageGeneratorPage({ recordId, onBack }: MessageGeneratorPageProps) {
  const { state } = useApp();
  const action = state.analysis.find((a) => a.recordId === recordId);
  const [channel, setChannel] = useState<MessageChannel>('whatsapp');
  const [tone, setTone] = useState<MessageTone>(state.settings.followUpTone || 'professional');
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (action) {
      setMessage(generateMessage(action.record, action, channel, tone, state.settings.currency));
    }
  }, [action, channel, tone]);

  const handleRegenerate = () => {
    if (action) {
      setMessage(generateMessage(action.record, action, channel, tone, state.settings.currency));
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!action) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-500">Action not found.</p>
        <button onClick={onBack} className="btn-secondary mt-4">Go back</button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <button onClick={onBack} className="btn-ghost -ml-2">
        <ArrowLeft size={18} />
        Back
      </button>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Follow-up message</h1>
        <p className="mt-1 text-gray-500">For {action.record.customer || 'this customer'} — {action.record.reference || action.record.recordType}</p>
      </div>

      <div className="card p-5">
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Channel</label>
            <div className="flex gap-2">
              <button
                onClick={() => setChannel('whatsapp')}
                className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${
                  channel === 'whatsapp' ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <MessageSquare size={16} />
                WhatsApp style
              </button>
              <button
                onClick={() => setChannel('email')}
                className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${
                  channel === 'email' ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Mail size={16} />
                Email style
              </button>
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Tone</label>
            <div className="flex gap-2">
              <button
                onClick={() => setTone('professional')}
                className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${
                  tone === 'professional' ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                Professional
              </button>
              <button
                onClick={() => setTone('friendly')}
                className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${
                  tone === 'friendly' ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                Friendly
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-5">
        <div className="mb-3 flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">Message (editable)</label>
          <button onClick={handleRegenerate} className="btn-ghost text-xs">
            <RefreshCw size={14} />
            Regenerate
          </button>
        </div>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={8}
          className="w-full rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-900 transition-colors focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
        />
        <div className="mt-3 flex gap-3">
          <button onClick={handleCopy} className="btn-primary flex-1">
            {copied ? <><Check size={18} /> Copied!</> : <><Copy size={18} /> Copy message</>}
          </button>
        </div>
      </div>

      <div className="rounded-xl bg-gray-50 px-4 py-3 text-xs text-gray-500">
        Recoverly does not send messages automatically. Copy this message and paste it into WhatsApp, email, or any other tool you use.
      </div>
    </div>
  );
}
