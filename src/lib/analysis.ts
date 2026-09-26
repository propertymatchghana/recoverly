import type { NormalizedRecord, AnalysisResult, ActionCategory, Priority } from '@/types';
import { daysBetween } from './format';

const PAID_STATUSES = ['paid', 'completed', 'cancelled', 'closed', 'settled'];
const OPEN_QUOTE_STATUSES = ['open', 'pending', 'awaiting response', 'awaiting_response', 'sent', 'submitted', 'delivered', 'outstanding'];

function isPaidStatus(status: string): boolean {
  return PAID_STATUSES.some((s) => status.toLowerCase().includes(s));
}

function isOpenQuoteStatus(status: string): boolean {
  return OPEN_QUOTE_STATUSES.some((s) => status.toLowerCase().includes(s));
}

function priorityScore(category: ActionCategory, daysOverdue: number | null, amount: number | null, daysInactive: number | null): number {
  let score = 0;
  if (category === 'overdue') {
    score += 50;
    if (daysOverdue !== null) score += Math.min(daysOverdue, 60);
    if (amount !== null) score += Math.min(amount / 1000, 30);
  }
  if (category === 'quotation_followup') {
    score += 30;
    if (amount !== null) score += Math.min(amount / 1000, 25);
  }
  if (category === 'customer_inactivity') {
    score += 20;
    if (daysInactive !== null) score += Math.min(daysInactive / 2, 20);
  }
  if (category === 'due_soon') {
    score += 15;
    if (amount !== null) score += Math.min(amount / 1000, 10);
  }
  if (category === 'missing_data') {
    score += 5;
  }
  return score;
}

export function scoreToPriority(score: number): Priority {
  if (score >= 60) return 'high';
  if (score >= 25) return 'medium';
  return 'low';
}

export function analyzeRecords(records: NormalizedRecord[]): AnalysisResult[] {
  const results: AnalysisResult[] = [];

  for (const record of records) {
    const daysOverdue = record.dueDate ? daysBetween(record.dueDate) : null;
    const daysSinceActivity = record.lastContact ? daysBetween(record.lastContact) : null;
    const categories: ActionCategory[] = [];

    // Check overdue
    if (
      record.recordType === 'invoice' &&
      daysOverdue !== null &&
      daysOverdue > 0 &&
      !isPaidStatus(record.status)
    ) {
      categories.push('overdue');
    }

    // Check due soon
    if (
      record.recordType === 'invoice' &&
      daysOverdue !== null &&
      daysOverdue >= -7 &&
      daysOverdue < 0 &&
      !isPaidStatus(record.status)
    ) {
      categories.push('due_soon');
    }

    // Check quotation follow-up
    if (
      record.recordType === 'quotation' &&
      isOpenQuoteStatus(record.status)
    ) {
      const daysSinceQuote = record.date ? daysBetween(record.date) : null;
      const daysSince = daysSinceActivity ?? daysSinceQuote;
      if (daysSince === null || daysSince >= 5) {
        categories.push('quotation_followup');
      }
    }

    // Check customer inactivity
    if (daysSinceActivity !== null && daysSinceActivity > 30) {
      categories.push('customer_inactivity');
    }

    // Check missing data
    const missing: string[] = [];
    if (!record.customer) missing.push('customer name');
    if (record.amount === null && (record.recordType === 'invoice' || record.recordType === 'quotation')) missing.push('amount');
    if (!record.dueDate && record.recordType === 'invoice') missing.push('due date');
    if (!record.status) missing.push('status');
    if (missing.length > 0) {
      categories.push('missing_data');
    }

    // If no issues, it's healthy — skip
    if (categories.length === 0) continue;

    // Pick the highest priority category
    const categoryOrder: ActionCategory[] = ['overdue', 'quotation_followup', 'customer_inactivity', 'due_soon', 'missing_data'];
    const primaryCategory = categoryOrder.find((c) => categories.includes(c)) || 'healthy';

    const score = priorityScore(primaryCategory, daysOverdue, record.amount, daysSinceActivity);
    const priority = scoreToPriority(score);

    let reason = '';
    let recommendedAction = '';

    switch (primaryCategory) {
      case 'overdue':
        reason = `This ${record.recordType} of ${record.amount ? `GH₵${record.amount.toLocaleString()}` : 'unknown amount'} is ${daysOverdue} days past its due date and is not marked as paid.`;
        recommendedAction = 'Follow up regarding payment';
        break;
      case 'due_soon':
        reason = `This invoice is due in ${Math.abs(daysOverdue || 0)} days and has not been marked as paid.`;
        recommendedAction = 'Send payment reminder';
        break;
      case 'quotation_followup':
        reason = `This quotation ${record.reference ? `(${record.reference}) ` : ''}${record.amount ? `for GH₵${record.amount.toLocaleString()} ` : ''}has had no response for ${daysSinceActivity ?? 'some'} days.`;
        recommendedAction = 'Follow up on quotation';
        break;
      case 'customer_inactivity':
        reason = `No contact with ${record.customer || 'this customer'} for ${daysSinceActivity} days. They may need a check-in.`;
        recommendedAction = 'Reach out to customer';
        break;
      case 'missing_data':
        reason = `This record is missing: ${missing.join(', ')}. Complete data helps identify actions.`;
        recommendedAction = 'Update record information';
        break;
      default:
        reason = 'This record appears healthy.';
        recommendedAction = 'No action needed';
    }

    results.push({
      recordId: record.id,
      record,
      category: primaryCategory,
      priority,
      reason,
      recommendedAction,
      daysOverdue,
      daysSinceActivity,
      amount: record.amount,
    });
  }

  // Sort by priority then score
  const priorityOrder: Record<Priority, number> = { high: 0, medium: 1, low: 2 };
  results.sort((a, b) => {
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    const scoreA = priorityScore(a.category, a.daysOverdue, a.amount, a.daysSinceActivity);
    const scoreB = priorityScore(b.category, b.daysOverdue, b.amount, b.daysSinceActivity);
    return scoreB - scoreA;
  });

  return results;
}

export function getSummaryStats(analysis: AnalysisResult[]) {
  const overdue = analysis.filter((a) => a.category === 'overdue');
  const quotations = analysis.filter((a) => a.category === 'quotation_followup');
  const inactive = analysis.filter((a) => a.category === 'customer_inactivity');
  const highPriority = analysis.filter((a) => a.priority === 'high');

  const overdueAmount = overdue.reduce((sum, a) => sum + (a.amount || 0), 0);
  const quotationAmount = quotations.reduce((sum, a) => sum + (a.amount || 0), 0);

  return {
    overdueCount: overdue.length,
    overdueAmount,
    quotationCount: quotations.length,
    quotationAmount,
    inactiveCount: inactive.length,
    highPriorityCount: highPriority.length,
    totalActions: analysis.length,
  };
}
