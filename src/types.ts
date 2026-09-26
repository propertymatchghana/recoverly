export type RecordType = 'invoice' | 'quotation' | 'customer' | 'payment' | 'unknown';

export type Priority = 'high' | 'medium' | 'low';

export type ActionCategory =
  | 'overdue'
  | 'due_soon'
  | 'quotation_followup'
  | 'customer_inactivity'
  | 'missing_data'
  | 'healthy';

export type Status = 'paid' | 'completed' | 'cancelled' | 'open' | 'pending' | 'sent' | 'awaiting_response' | 'unpaid' | 'unknown';

export interface NormalizedRecord {
  id: string;
  customer: string;
  phone: string;
  email: string;
  reference: string;
  recordType: RecordType;
  amount: number | null;
  date: string | null;
  dueDate: string | null;
  status: string;
  lastContact: string | null;
  rawRow: Record<string, unknown>;
}

export interface AnalysisResult {
  recordId: string;
  record: NormalizedRecord;
  category: ActionCategory;
  priority: Priority;
  reason: string;
  recommendedAction: string;
  daysOverdue: number | null;
  daysSinceActivity: number | null;
  amount: number | null;
}

export interface ColumnMapping {
  customer: string | null;
  phone: string | null;
  email: string | null;
  reference: string | null;
  amount: string | null;
  date: string | null;
  dueDate: string | null;
  status: string | null;
  lastContact: string | null;
  recordType: string | null;
}

export interface ParsedFile {
  fileName: string;
  rowCount: number;
  columnCount: number;
  sheets: string[];
  headers: string[];
  rows: Record<string, unknown>[];
}

export interface AppSettings {
  businessName: string;
  currency: string;
  followUpTone: 'professional' | 'friendly';
}

export interface AppState {
  isAuth: boolean;
  user: { name: string; email: string } | null;
  parsedFile: ParsedFile | null;
  columnMapping: ColumnMapping | null;
  records: NormalizedRecord[];
  analysis: AnalysisResult[];
  isDemoData: boolean;
  settings: AppSettings;
  handledActions: string[];
  dismissedActions: string[];
}
