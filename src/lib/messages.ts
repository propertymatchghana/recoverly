import type { NormalizedRecord, AnalysisResult } from '@/types';
import { formatDate, formatCurrency } from './format';

export type MessageType = 'overdue' | 'quotation' | 'inactive' | 'generic';
export type MessageChannel = 'whatsapp' | 'email';
export type MessageTone = 'professional' | 'friendly';

export function getMessageType(result: AnalysisResult): MessageType {
  switch (result.category) {
    case 'overdue':
    case 'due_soon':
      return 'overdue';
    case 'quotation_followup':
      return 'quotation';
    case 'customer_inactivity':
      return 'inactive';
    default:
      return 'generic';
  }
}

export function generateMessage(
  record: NormalizedRecord,
  result: AnalysisResult,
  channel: MessageChannel,
  tone: MessageTone,
  currency: string = 'GHS'
): string {
  const customerName = record.customer || 'there';
  const reference = record.reference || '';
  const amount = record.amount !== null ? formatCurrency(record.amount, currency) : '';
  const dueDate = record.dueDate ? formatDate(record.dueDate) : '';
  const type = getMessageType(result);

  const greeting = tone === 'friendly'
    ? `Hi ${customerName}`
    : `Good morning ${customerName}`;

  const closing = tone === 'friendly'
    ? 'Thanks so much!'
    : 'Thank you.';

  let body = '';

  switch (type) {
    case 'overdue':
      body = `We're following up regarding ${reference ? `${reference} ` : ''}${amount ? `for ${amount} ` : ''}${dueDate ? `which was due on ${dueDate}` : 'which is currently outstanding'}. Please let us know when we can expect payment.`;
      break;
    case 'quotation':
      body = `We're following up regarding ${reference ? `quotation ${reference} ` : 'our recent quotation'}${amount ? ` for ${amount}` : ''}. We wanted to check whether you had any questions or needed any further information from us.`;
      break;
    case 'inactive':
      body = `We wanted to check in and see how things are going. It's been a while since we last connected, and we'd be happy to assist if you have any current requirements.`;
      break;
    default:
      body = `We're reaching out regarding your account. Please let us know if there's anything we can help with.`;
  }

  if (channel === 'email') {
    const subject = type === 'overdue'
      ? `Follow-up: ${reference || 'Outstanding Invoice'}`
      : type === 'quotation'
        ? `Following up on quotation ${reference || ''}`
        : type === 'inactive'
          ? `Checking in`
          : 'Following up';

    return `Subject: ${subject}\n\n${greeting},\n\n${body}\n\n${closing}`;
  }

  // WhatsApp style — shorter, more conversational
  return `${greeting}. ${body} ${closing}`;
}
