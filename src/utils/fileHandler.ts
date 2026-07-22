import * as XLSX from 'xlsx';
import { FileFormat, SheetData } from '../types';

/**
 * Parses file extension to FileFormat
 */
export function getFileFormat(filename: string): FileFormat {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  if (ext === 'xlsx') return 'xlsx';
  if (ext === 'xls') return 'xls';
  if (ext === 'csv') return 'csv';
  if (ext === 'tsv') return 'tsv';
  if (ext === 'ods') return 'ods';
  return 'csv';
}

/**
 * Reads spreadsheet file (XLSX, XLS, CSV, TSV, ODS) offline in browser memory
 */
export async function parseSpreadsheetFile(file: File): Promise<{
  sheets: SheetData[];
  defaultSheetIndex: number;
}> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) {
          reject(new Error('Failed to read file contents'));
          return;
        }

        const workbook = XLSX.read(data, {
          type: 'array',
          cellDates: true,
          cellStyles: true,
          raw: false,
        });

        const sheets: SheetData[] = [];
        const fileFormat = getFileFormat(file.name);

        workbook.SheetNames.forEach((sheetName) => {
          const worksheet = workbook.Sheets[sheetName];
          // Convert sheet to JSON array of objects
          const jsonData = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, {
            defval: '',
            blankrows: false,
          });

          if (jsonData.length > 0) {
            // Extract headers from the first object keys, plus all possible keys across objects
            const headerSet = new Set<string>();
            jsonData.forEach((row) => {
              Object.keys(row).forEach((key) => headerSet.add(key));
            });

            const headers = Array.from(headerSet);

            sheets.push({
              sheetName,
              headers,
              rows: jsonData,
              fileName: file.name,
              fileFormat,
            });
          }
        });

        if (sheets.length === 0) {
          reject(new Error('No readable data found in the file.'));
          return;
        }

        resolve({
          sheets,
          defaultSheetIndex: 0,
        });
      } catch (err: any) {
        reject(new Error(`Failed to parse file: ${err.message || err}`));
      }
    };

    reader.onerror = () => reject(new Error('File reading error.'));
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Downloads cleaned sheet data back to the original format or chosen export format
 */
export function exportSpreadsheetFile(
  headers: string[],
  rows: Record<string, any>[],
  exportFormat: FileFormat,
  originalFilename: string,
  sheetName: string = 'Cleaned Data'
) {
  // Build filename
  const baseName = originalFilename.replace(/\.[^/.]+$/, '');
  const cleanFilename = `${baseName}_cleaned.${exportFormat}`;

  // Prepare worksheet data array [headers, ...rows]
  const dataArray: any[][] = [];
  dataArray.push(headers);

  rows.forEach((row) => {
    const rowValues = headers.map((h) => row[h] ?? '');
    dataArray.push(rowValues);
  });

  const worksheet = XLSX.utils.aoa_to_sheet(dataArray);

  // Auto-fit column widths for spreadsheet view
  const colWidths = headers.map((header) => {
    let maxLen = header.length;
    rows.forEach((row) => {
      const valStr = String(row[header] ?? '');
      if (valStr.length > maxLen) {
        maxLen = valStr.length;
      }
    });
    return { wch: Math.min(Math.max(maxLen + 3, 10), 50) };
  });
  worksheet['!cols'] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  if (exportFormat === 'csv') {
    const csvContent = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    saveBlob(blob, cleanFilename);
  } else if (exportFormat === 'tsv') {
    const tsvContent = XLSX.utils.sheet_to_csv(worksheet, { FS: '\t' });
    const blob = new Blob(['\uFEFF' + tsvContent], { type: 'text/tab-separated-values;charset=utf-8;' });
    saveBlob(blob, cleanFilename);
  } else {
    // XLSX or XLS or ODS
    const bookType = exportFormat === 'xls' ? 'biff8' : exportFormat === 'ods' ? 'ods' : 'xlsx';
    const wbout = XLSX.write(workbook, { bookType: bookType as any, type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    saveBlob(blob, cleanFilename);
  }
}

function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
