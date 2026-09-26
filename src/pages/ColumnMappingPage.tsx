import { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { autoDetectColumns, FIELD_KEYS, FIELD_LABELS } from '@/lib/columnDetection';
import { ArrowRight, CheckCircle2, Info } from 'lucide-react';
import type { ColumnMapping } from '@/types';

interface ColumnMappingPageProps {
  onComplete: () => void;
}

export function ColumnMappingPage({ onComplete }: ColumnMappingPageProps) {
  const { state, setColumnMapping, runAnalysis } = useApp();
  const headers = state.parsedFile?.headers || [];
  const initial = useMemo(() => autoDetectColumns(headers), [headers]);
  const [mapping, setMapping] = useState<ColumnMapping>(state.columnMapping || initial);

  if (!state.parsedFile) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-500">No file uploaded. Please upload a file first.</p>
      </div>
    );
  }

  const handleFieldChange = (field: keyof ColumnMapping, value: string) => {
    setMapping((prev) => ({ ...prev, [field]: value || null }));
  };

  const handleContinue = () => {
    setColumnMapping(mapping);
    runAnalysis(state.parsedFile!.rows, mapping);
    onComplete();
  };

  const detectedCount = Object.values(mapping).filter(Boolean).length;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Map your columns</h1>
        <p className="mt-1 text-gray-500">We've automatically detected the most likely columns. Review and adjust if needed.</p>
      </div>

      <div className="flex items-center gap-2 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-700">
        <Info size={18} className="shrink-0" />
        <span>{detectedCount} of {FIELD_KEYS.length} fields detected. You can adjust any mapping below.</span>
      </div>

      <div className="card p-5 sm:p-6">
        <div className="space-y-4">
          {FIELD_KEYS.map((field) => {
            const value = mapping[field as keyof ColumnMapping];
            const isDetected = value && value !== '';
            return (
              <div key={field} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 sm:w-1/3">
                  {isDetected && <CheckCircle2 size={16} className="text-green-500" />}
                  <label className="text-sm font-medium text-gray-700">{FIELD_LABELS[field]}</label>
                </div>
                <div className="sm:w-2/3">
                  <select
                    value={value || ''}
                    onChange={(e) => handleFieldChange(field as keyof ColumnMapping, e.target.value)}
                    className="select-field"
                  >
                    <option value="">— Not mapped —</option>
                    {headers.map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <button onClick={handleContinue} className="btn-primary w-full">
        Continue to analysis
        <ArrowRight size={18} />
      </button>
    </div>
  );
}
