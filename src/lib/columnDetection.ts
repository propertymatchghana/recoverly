import type { ColumnMapping } from '@/types';

export const FIELD_KEYS = [
  'customer',
  'phone',
  'email',
  'reference',
  'amount',
  'date',
  'dueDate',
  'status',
  'lastContact',
  'recordType',
] as const;

export const FIELD_LABELS: Record<string, string> = {
  customer: 'Customer / Client',
  phone: 'Phone',
  email: 'Email',
  reference: 'Reference / Invoice / Quote No.',
  amount: 'Amount',
  date: 'Date',
  dueDate: 'Due Date',
  status: 'Status',
  lastContact: 'Last Contact / Activity',
  recordType: 'Record Type',
};

const COLUMN_SYNONYMS: Record<string, string[]> = {
  customer: ['customer', 'customer name', 'client', 'client name', 'company', 'company name', 'business', 'account', 'account name', 'name'],
  phone: ['phone', 'phone number', 'mobile', 'whatsapp', 'tel', 'telephone', 'contact number', 'phone no'],
  email: ['email', 'email address', 'e-mail', 'mail'],
  reference: ['invoice', 'invoice number', 'invoice no', 'invoice #', 'quote', 'quote number', 'quotation', 'quotation number', 'quotation no', 'reference', 'ref', 'id', 'reference no', 'reference number', 'invoice no.'],
  amount: ['amount', 'total', 'value', 'invoice amount', 'quote amount', 'balance', 'outstanding', 'price', 'cost', 'total amount', 'grand total'],
  date: ['date', 'invoice date', 'quote date', 'created date', 'issue date', 'transaction date', 'order date', 'created at'],
  dueDate: ['due date', 'payment due', 'deadline', 'due', 'expected payment', 'payment date', 'due by'],
  status: ['status', 'payment status', 'invoice status', 'quote status', 'payment', 'state'],
  lastContact: ['last contact', 'last follow up', 'last follow-up', 'contact date', 'last activity', 'last contact date', 'last update', 'updated', 'updated at', 'last interaction'],
  recordType: ['type', 'record type', 'category', 'document type', 'entry type', 'kind'],
};

function normalize(s: string): string {
  return s.toLowerCase().trim().replace(/[_\-./]+/g, ' ').replace(/\s+/g, ' ').trim();
}

export function autoDetectColumns(headers: string[]): ColumnMapping {
  const mapping: ColumnMapping = {
    customer: null,
    phone: null,
    email: null,
    reference: null,
    amount: null,
    date: null,
    dueDate: null,
    status: null,
    lastContact: null,
    recordType: null,
  };

  const normHeaders = headers.map((h) => ({ original: h, norm: normalize(h) }));

  for (const field of FIELD_KEYS) {
    const synonyms = COLUMN_SYNONYMS[field];
    // exact match first
    for (const h of normHeaders) {
      if (synonyms.includes(h.norm)) {
        mapping[field] = h.original;
        break;
      }
    }
    if (mapping[field]) continue;
    // partial match
    for (const h of normHeaders) {
      if (h.norm === '') continue;
      if (synonyms.some((s) => h.norm.includes(s) || s.includes(h.norm))) {
        mapping[field] = h.original;
        break;
      }
    }
  }

  return mapping;
}

export function inferRecordType(row: Record<string, unknown>, mapping: ColumnMapping): 'invoice' | 'quotation' | 'customer' | 'payment' | 'unknown' {
  if (mapping.recordType) {
    const val = String(row[mapping.recordType] || '').toLowerCase();
    if (val.includes('quot') || val.includes('lead') || val.includes('proposal')) return 'quotation';
    if (val.includes('invoic')) return 'invoice';
    if (val.includes('customer') || val.includes('client')) return 'customer';
    if (val.includes('payment') || val.includes('receipt')) return 'payment';
  }
  if (mapping.reference) {
    const val = String(row[mapping.reference] || '').toLowerCase();
    if (val.startsWith('qt') || val.startsWith('qu') || val.includes('quote')) return 'quotation';
    if (val.startsWith('inv') || val.includes('invoice')) return 'invoice';
  }
  if (mapping.dueDate) return 'invoice';
  if (mapping.amount && !mapping.dueDate) {
    const status = mapping.status ? String(row[mapping.status] || '').toLowerCase() : '';
    if (status.includes('await') || status.includes('sent') || status.includes('pending')) return 'quotation';
    return 'invoice';
  }
  return 'unknown';
}

export function parseAmount(val: unknown): number | null {
  if (val === null || val === undefined || val === '') return null;
  if (typeof val === 'number') return val;
  const s = String(val).replace(/[^0-9.\-]/g, '');
  const n = parseFloat(s);
  return isNaN(n) ? null : n;
}

export function parseDate(val: unknown): string | null {
  if (val === null || val === undefined || val === '') return null;
  // Excel serial date number
  if (typeof val === 'number' && val > 25569 && val < 60000) {
    const ms = (val - 25569) * 86400 * 1000;
    const d = new Date(ms);
    return isNaN(d.getTime()) ? null : d.toISOString().split('T')[0];
  }
  const d = new Date(String(val));
  if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];
  // try DD/MM/YYYY
  const parts = String(val).split(/[/.\-]/);
  if (parts.length === 3) {
    const [a, b, c] = parts.map(Number);
    if (a > 31 && b <= 12) {
      const d2 = new Date(a, b - 1, c);
      if (!isNaN(d2.getTime())) return d2.toISOString().split('T')[0];
    }
    if (a <= 31 && b <= 12 && c > 31) {
      const d2 = new Date(c, b - 1, a);
      if (!isNaN(d2.getTime())) return d2.toISOString().split('T')[0];
    }
  }
  return null;
}

export function normalizeRecords(
  rows: Record<string, unknown>[],
  mapping: ColumnMapping
): import('@/types').NormalizedRecord[] {
  return rows.map((row, idx) => {
    const recordType = inferRecordType(row, mapping);
    return {
      id: `row-${idx}`,
      customer: mapping.customer ? String(row[mapping.customer] ?? '').trim() : '',
      phone: mapping.phone ? String(row[mapping.phone] ?? '').trim() : '',
      email: mapping.email ? String(row[mapping.email] ?? '').trim() : '',
      reference: mapping.reference ? String(row[mapping.reference] ?? '').trim() : '',
      recordType,
      amount: mapping.amount ? parseAmount(row[mapping.amount]) : null,
      date: mapping.date ? parseDate(row[mapping.date]) : null,
      dueDate: mapping.dueDate ? parseDate(row[mapping.dueDate]) : null,
      status: mapping.status ? String(row[mapping.status] ?? '').trim() : '',
      lastContact: mapping.lastContact ? parseDate(row[mapping.lastContact]) : null,
      rawRow: row,
    };
  });
}
