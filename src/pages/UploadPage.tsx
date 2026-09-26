import { useState, useRef, useCallback } from 'react';
import { useApp } from '@/context/AppContext';
import { parseSpreadsheet } from '@/lib/parse';
import { UploadCloud, FileSpreadsheet, CheckCircle2, AlertCircle, Database, ArrowRight } from 'lucide-react';

interface UploadPageProps {
  onParsed: () => void;
  onDemo: () => void;
}

export function UploadPage({ onParsed, onDemo }: UploadPageProps) {
  const { setParsedFile } = useApp();
  const [dragging, setDragging] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parsed, setParsed] = useState<{ name: string; rows: number; cols: number; sheets: string[] } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(async (file: File) => {
    setError(null);
    const validExt = ['.xlsx', '.xls', '.csv'];
    const ext = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    if (!validExt.includes(ext)) {
      setError('Unsupported file type. Please upload an Excel (.xlsx, .xls) or CSV file.');
      return;
    }
    setParsing(true);
    try {
      const result = await parseSpreadsheet(file);
      setParsedFile(result);
      setParsed({ name: result.fileName, rows: result.rowCount, cols: result.columnCount, sheets: result.sheets });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not read this file. Please check the file and try again.');
    } finally {
      setParsing(false);
    }
  }, [setParsedFile]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Upload your business data</h1>
        <p className="mt-1 text-gray-500">Upload an Excel or CSV file containing invoices, quotations, customers, sales or payment information.</p>
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition-colors ${
          dragging ? 'border-brand-500 bg-brand-50' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".xlsx,.xls,.csv"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        />
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
          {parsing ? (
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
          ) : (
            <UploadCloud size={32} />
          )}
        </div>
        <p className="mt-4 text-base font-semibold text-gray-900">
          {parsing ? 'Reading your file...' : 'Drop your file here or click to browse'}
        </p>
        <p className="mt-1 text-sm text-gray-500">Supports .xlsx, .xls and .csv files</p>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
          <AlertCircle size={20} className="mt-0.5 shrink-0 text-red-600" />
          <div>
            <p className="text-sm font-semibold text-red-900">Could not read file</p>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {parsed && (
        <div className="card p-5 animate-slide-up">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <CheckCircle2 size={22} />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">{parsed.name}</p>
              <p className="text-sm text-gray-500">File read successfully</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-gray-50 p-3 text-center">
              <p className="text-xs text-gray-500">Rows</p>
              <p className="text-lg font-bold text-gray-900">{parsed.rows}</p>
            </div>
            <div className="rounded-xl bg-gray-50 p-3 text-center">
              <p className="text-xs text-gray-500">Columns</p>
              <p className="text-lg font-bold text-gray-900">{parsed.cols}</p>
            </div>
            <div className="rounded-xl bg-gray-50 p-3 text-center">
              <p className="text-xs text-gray-500">Sheets</p>
              <p className="text-lg font-bold text-gray-900">{parsed.sheets.length}</p>
            </div>
          </div>
          {parsed.sheets.length > 1 && (
            <p className="mt-2 text-xs text-gray-400">Detected sheets: {parsed.sheets.join(', ')}</p>
          )}
          <button onClick={onParsed} className="btn-primary mt-4 w-full">
            Continue to column mapping
            <ArrowRight size={18} />
          </button>
        </div>
      )}

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-gray-50 px-4 text-sm text-gray-400">or</span>
        </div>
      </div>

      <button onClick={onDemo} className="btn-secondary w-full">
        <Database size={18} />
        Use demo data
      </button>

      <div className="flex items-start gap-2 rounded-xl bg-gray-50 px-4 py-3 text-xs text-gray-500">
        <FileSpreadsheet size={16} className="mt-0.5 shrink-0" />
        <p>Your uploaded data stays in this browser in Version 1. Nothing is sent to any external server.</p>
      </div>
    </div>
  );
}
