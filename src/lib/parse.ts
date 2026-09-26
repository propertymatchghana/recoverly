import * as XLSX from 'xlsx';
import type { ParsedFile } from '@/types';

export async function parseSpreadsheet(file: File): Promise<ParsedFile> {
  const buf = await file.arrayBuffer();
  const wb = XLSX.read(buf, { type: 'array', cellDates: true });

  const sheets = wb.SheetNames;
  if (sheets.length === 0) {
    throw new Error('The spreadsheet appears to be empty.');
  }

  const sheetName = sheets[0];
  const sheet = wb.Sheets[sheetName];

  const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
    defval: '',
    raw: true,
    blankrows: false,
    dateNF: 'yyyy-mm-dd',
  });

  if (json.length === 0) {
    throw new Error('The spreadsheet contains no data rows.');
  }

  const headers = Object.keys(json[0]);

  return {
    fileName: file.name,
    rowCount: json.length,
    columnCount: headers.length,
    sheets,
    headers,
    rows: json,
  };
}
