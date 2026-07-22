import {
  CleaningOptions,
  CleaningStats,
  HeaderCasing,
  RowDiff,
  CellDiff,
  DuplicateRecord,
  DateFormatOption,
} from '../types';

/**
 * Trims leading/trailing whitespace, removes zero-width spaces, non-breaking spaces,
 * and collapses multiple consecutive spaces into a single space.
 */
export function cleanStringValue(
  val: string,
  trim: boolean,
  removeInvisible: boolean,
  collapseSpaces: boolean
): { text: string; wasTrimmed: boolean } {
  if (typeof val !== 'string') return { text: val, wasTrimmed: false };

  let result = val;

  if (removeInvisible) {
    // Remove zero-width spaces, BOM, control characters except standard line breaks
    result = result.replace(/[\u200B-\u200D\uFEFF]/g, '').replace(/[\u00A0]/g, ' ');
  }

  if (collapseSpaces) {
    result = result.replace(/[ \t]+/g, ' ');
  }

  if (trim) {
    result = result.trim();
  }

  return {
    text: result,
    wasTrimmed: result !== val,
  };
}

/**
 * Normalizes headers (e.g., " First Name # " -> "First Name" or "first_name")
 */
export function cleanHeader(
  header: string,
  casing: HeaderCasing,
  cleanNames: boolean
): string {
  if (!header) return 'Column';

  let cleaned = header.trim();

  if (cleanNames) {
    // Remove undesirable symbols at start/end
    cleaned = cleaned.replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, '');
    // Replace multi spaces or dashes with single space
    cleaned = cleaned.replace(/[\s\-_]+/g, ' ');
  }

  if (!cleaned) cleaned = header.trim() || 'Column';

  switch (casing) {
    case 'title':
      return cleaned
        .split(' ')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');
    case 'upper':
      return cleaned.toUpperCase();
    case 'lower':
      return cleaned.toLowerCase();
    case 'snake':
      return cleaned
        .toLowerCase()
        .replace(/\s+/g, '_');
    case 'camel':
      return cleaned
        .split(' ')
        .map((w, i) =>
          i === 0
            ? w.toLowerCase()
            : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
        )
        .join('');
    case 'none':
    default:
      return cleaned;
  }
}

/**
 * Sanitizes and formats emails
 */
export function cleanEmail(val: string): { email: string; isEmail: boolean } {
  const trimmed = val.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailRegex.test(trimmed)) {
    return { email: trimmed, isEmail: true };
  }
  return { email: val, isEmail: false };
}

/**
 * Formats phone numbers into standard readable format
 */
export function formatPhoneNumber(val: string): string {
  const digits = val.replace(/\D/g, '');
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  if (digits.length === 11 && digits.startsWith('1')) {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  return val;
}

/**
 * Smart date parser & formatter
 */
export function standardizeDate(val: any, targetFormat: DateFormatOption): { formatted: string; isValid: boolean } {
  if (val === null || val === undefined || val === '') {
    return { formatted: '', isValid: false };
  }

  let dateObj: Date | null = null;

  // Handle Excel serial date numbers (e.g., 44927)
  if (typeof val === 'number' && val > 25000 && val < 60000) {
    dateObj = new Date(Math.round((val - 25569) * 86400 * 1000));
  } else if (val instanceof Date && !isNaN(val.getTime())) {
    dateObj = val;
  } else {
    const strVal = String(val).trim();
    // Try native Date parsing
    const parsed = new Date(strVal);
    if (!isNaN(parsed.getTime())) {
      dateObj = parsed;
    } else {
      // Try DD/MM/YYYY or MM/DD/YYYY manual match
      const parts = strVal.split(/[\/\-\.]/);
      if (parts.length === 3) {
        let year = parseInt(parts[2], 10);
        let p1 = parseInt(parts[0], 10);
        let p2 = parseInt(parts[1], 10);
        if (year < 100) year += 2000;
        if (year > 1900 && p1 <= 12 && p2 <= 31) {
          dateObj = new Date(year, p1 - 1, p2);
        } else if (year > 1900 && p2 <= 12 && p1 <= 31) {
          dateObj = new Date(year, p2 - 1, p1);
        }
      }
    }
  }

  if (!dateObj || isNaN(dateObj.getTime())) {
    return { formatted: String(val), isValid: false };
  }

  const yyyy = dateObj.getFullYear();
  const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
  const dd = String(dateObj.getDate()).padStart(2, '0');
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  let result = '';
  switch (targetFormat) {
    case 'YYYY-MM-DD':
      result = `${yyyy}-${mm}-${dd}`;
      break;
    case 'MM/DD/YYYY':
      result = `${mm}/${dd}/${yyyy}`;
      break;
    case 'DD/MM/YYYY':
      result = `${dd}/${mm}/${yyyy}`;
      break;
    case 'MMM DD, YYYY':
      result = `${monthNames[dateObj.getMonth()]} ${dd}, ${yyyy}`;
      break;
  }

  return { formatted: result, isValid: true };
}

/**
 * Standardize numeric values (e.g., "$1,250.50" -> 1250.5, "15%" -> 0.15)
 */
export function standardizeNumber(val: any): { numericValue: number | string; isNumeric: boolean } {
  if (typeof val === 'number') return { numericValue: val, isNumeric: true };
  if (!val || typeof val !== 'string') return { numericValue: val, isNumeric: false };

  const str = val.trim();
  // Check if string contains currency or percent or thousands commas
  const cleaned = str.replace(/[\$,]/g, '').trim();

  if (cleaned.endsWith('%')) {
    const num = parseFloat(cleaned.replace('%', ''));
    if (!isNaN(num)) {
      return { numericValue: num / 100, isNumeric: true };
    }
  }

  const num = parseFloat(cleaned);
  if (!isNaN(num) && /^-?\d+(\.\d+)?$/.test(cleaned)) {
    return { numericValue: num, isNumeric: true };
  }

  return { numericValue: val, isNumeric: false };
}

/**
 * Checks if a value is considered missing / null / placeholder
 */
export function isMissingValue(val: any): boolean {
  if (val === null || val === undefined) return true;
  if (typeof val === 'string') {
    const s = val.trim().toLowerCase();
    return (
      s === '' ||
      s === 'null' ||
      s === 'undefined' ||
      s === 'n/a' ||
      s === 'na' ||
      s === '#n/a' ||
      s === '-' ||
      s === '--' ||
      s === 'none'
    );
  }
  return false;
}

/**
 * Checks if a row is completely empty or missing
 */
export function isRowEmpty(row: Record<string, any>, headers: string[]): boolean {
  return headers.every((h) => isMissingValue(row[h]));
}

/**
 * Smart Title Case for names/strings
 */
export function toTitleCase(str: string): string {
  if (!str) return str;
  return str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Main Data Cleaning Engine
 */
export function cleanSheetData(
  headers: string[],
  rows: Record<string, any>[],
  options: CleaningOptions
): {
  cleanedHeaders: string[];
  cleanedRows: Record<string, any>[];
  rowDiffs: RowDiff[];
  stats: CleaningStats;
  duplicatesRemovedList: DuplicateRecord[];
  removedEmptyRowsCount: number;
  removedEmptyColsCount: number;
} {
  const initialRows = rows.length;
  const initialCols = headers.length;

  let whitespacesTrimmed = 0;
  let casingChanges = 0;
  let datesFormatted = 0;
  let numbersFormatted = 0;
  let missingValuesHandled = 0;

  // 1. Clean Headers
  const headerMap: Record<string, string> = {};
  const cleanedHeaders: string[] = headers.map((origH) => {
    const cleanedH = cleanHeader(origH, options.headerCasing, options.cleanHeaderNames);
    headerMap[origH] = cleanedH;
    return cleanedH;
  });

  // 2. Map row keys to new headers & apply cell cleaning
  let processedRows: { originalRow: Record<string, any>; cleanedRow: Record<string, any>; diffs: Record<string, CellDiff> }[] = [];

  for (let rIdx = 0; rIdx < rows.length; rIdx++) {
    const origRow = rows[rIdx];
    const newRow: Record<string, any> = {};
    const diffs: Record<string, CellDiff> = {};

    headers.forEach((origHeader) => {
      const newHeader = headerMap[origHeader];
      let val = origRow[origHeader];
      const origVal = val;
      let diffType: CellDiff['type'] = 'none';

      // A. Check missing value
      if (options.handleMissingValues && isMissingValue(val)) {
        if (val !== options.missingValueReplacement) {
          val = options.missingValueReplacement;
          missingValuesHandled++;
          diffType = 'missing';
        }
      }

      // If value is non-empty string, apply text transformations
      if (typeof val === 'string' && val.length > 0) {
        // B. Trim / whitespace
        const trimRes = cleanStringValue(
          val,
          options.trimWhitespace,
          options.removeInvisibleChars,
          options.collapseMultipleSpaces
        );
        if (trimRes.wasTrimmed) {
          val = trimRes.text;
          whitespacesTrimmed++;
          if (diffType === 'none') diffType = 'whitespace';
        }

        // C. Smart Email Detection
        if (options.sanitizeEmails && (newHeader.toLowerCase().includes('email') || val.includes('@'))) {
          const emailRes = cleanEmail(val);
          if (emailRes.isEmail && emailRes.email !== val) {
            val = emailRes.email;
            casingChanges++;
            if (diffType === 'none') diffType = 'casing';
          }
        }
        // D. Phone Number Formatting
        else if (options.formatPhoneNumbers && (newHeader.toLowerCase().includes('phone') || newHeader.toLowerCase().includes('mobile') || newHeader.toLowerCase().includes('tel'))) {
          const formattedPhone = formatPhoneNumber(val);
          if (formattedPhone !== val) {
            val = formattedPhone;
            casingChanges++;
            if (diffType === 'none') diffType = 'casing';
          }
        }
        // E. Smart Casing for Name / City / Country columns
        else if (options.autoDetectSmartCasing) {
          const lowerCol = newHeader.toLowerCase();
          if (lowerCol.includes('name') || lowerCol.includes('city') || lowerCol.includes('country') || lowerCol.includes('address') || lowerCol.includes('company')) {
            const titleCased = toTitleCase(val);
            if (titleCased !== val) {
              val = titleCased;
              casingChanges++;
              if (diffType === 'none') diffType = 'casing';
            }
          }
        }

        // F. Custom Find & Replace
        if (options.enableFindReplace && options.findText) {
          if (options.findReplaceColumn === 'all' || options.findReplaceColumn === newHeader) {
            if (val.includes(options.findText)) {
              val = val.replaceAll(options.findText, options.replaceText);
              if (diffType === 'none') diffType = 'custom';
            }
          }
        }
      }

      // G. Date Standardization
      if (options.standardizeDates && val !== null && val !== undefined && val !== '') {
        const lowerCol = newHeader.toLowerCase();
        if (lowerCol.includes('date') || lowerCol.includes('time') || lowerCol.includes('dob') || lowerCol.includes('created') || lowerCol.includes('updated') || val instanceof Date || (typeof val === 'number' && val > 25000 && val < 60000)) {
          const dateRes = standardizeDate(val, options.dateFormat);
          if (dateRes.isValid && dateRes.formatted !== String(origVal)) {
            val = dateRes.formatted;
            datesFormatted++;
            if (diffType === 'none') diffType = 'date';
          }
        }
      }

      // H. Number Standardization
      if (options.standardizeNumbers && typeof val === 'string' && val.length > 0) {
        const lowerCol = newHeader.toLowerCase();
        if (lowerCol.includes('price') || lowerCol.includes('amount') || lowerCol.includes('cost') || lowerCol.includes('salary') || lowerCol.includes('rate') || lowerCol.includes('total') || lowerCol.includes('qty') || lowerCol.includes('count')) {
          const numRes = standardizeNumber(val);
          if (numRes.isNumeric && numRes.numericValue !== origVal) {
            val = numRes.numericValue;
            numbersFormatted++;
            if (diffType === 'none') diffType = 'number';
          }
        }
      }

      newRow[newHeader] = val;
      diffs[newHeader] = {
        originalValue: origVal,
        newValue: val,
        type: diffType,
      };
    });

    processedRows.push({
      originalRow: origRow,
      cleanedRow: newRow,
      diffs,
    });
  }

  // 3. Filter Empty Rows if option enabled
  let removedEmptyRowsCount = 0;
  if (options.removeEmptyRows) {
    const beforeCount = processedRows.length;
    processedRows = processedRows.filter((p) => !isRowEmpty(p.cleanedRow, cleanedHeaders));
    removedEmptyRowsCount = beforeCount - processedRows.length;
  }

  // 4. Duplicate Detection & Removal
  const duplicatesRemovedList: DuplicateRecord[] = [];
  let finalProcessedRows = processedRows;

  if (options.removeDuplicates) {
    const seen = new Set<string>();
    const uniqueRows: typeof processedRows = [];

    processedRows.forEach((p, idx) => {
      let key = '';
      if (options.duplicateKeyColumns.length > 0) {
        key = options.duplicateKeyColumns
          .map((col) => String(p.cleanedRow[col] ?? '').trim().toLowerCase())
          .join('||');
      } else {
        // Compare entire row values
        key = cleanedHeaders
          .map((col) => String(p.cleanedRow[col] ?? '').trim().toLowerCase())
          .join('||');
      }

      if (seen.has(key)) {
        duplicatesRemovedList.push({
          originalIndex: idx,
          row: p.cleanedRow,
          duplicateOfIndex: Array.from(seen).indexOf(key),
        });
      } else {
        seen.add(key);
        uniqueRows.push(p);
      }
    });

    finalProcessedRows = uniqueRows;
  }

  // 5. Remove Empty Columns if option enabled
  let finalHeaders = [...cleanedHeaders];
  let removedEmptyColsCount = 0;
  if (options.removeEmptyCols) {
    const nonCols = finalHeaders.filter((h) => {
      const hasSomeData = finalProcessedRows.some((p) => !isMissingValue(p.cleanedRow[h]));
      return hasSomeData;
    });
    removedEmptyColsCount = finalHeaders.length - nonCols.length;
    finalHeaders = nonCols;
  }

  // 6. Build RowDiffs & Stats
  const rowDiffs: RowDiff[] = finalProcessedRows.map((p, idx) => {
    const isChanged = Object.values(p.diffs).some((d) => d.type !== 'none');
    return {
      rowIndex: idx,
      originalRow: p.originalRow,
      cleanedRow: p.cleanedRow,
      diffs: p.diffs,
      isChanged,
    };
  });

  const finalRows = finalProcessedRows.map((p) => p.cleanedRow);

  const totalChanges =
    whitespacesTrimmed +
    casingChanges +
    datesFormatted +
    numbersFormatted +
    missingValuesHandled +
    duplicatesRemovedList.length +
    removedEmptyRowsCount +
    removedEmptyColsCount;

  // Calculate Health Score (100% minus defect percentage)
  const totalCells = Math.max(1, initialRows * initialCols);
  const defectCount =
    whitespacesTrimmed +
    casingChanges +
    datesFormatted +
    numbersFormatted +
    missingValuesHandled +
    duplicatesRemovedList.length * initialCols;
  const errorRatio = Math.min(1, defectCount / totalCells);
  const healthScore = Math.round((1 - errorRatio) * 100);

  const stats: CleaningStats = {
    initialRows,
    initialCols,
    finalRows: finalRows.length,
    finalCols: finalHeaders.length,
    duplicatesRemoved: duplicatesRemovedList.length,
    whitespacesTrimmed,
    casingChanges,
    datesFormatted,
    numbersFormatted,
    missingValuesHandled,
    emptyRowsRemoved: removedEmptyRowsCount,
    emptyColsRemoved: removedEmptyColsCount,
    totalChanges,
    healthScore,
  };

  return {
    cleanedHeaders: finalHeaders,
    cleanedRows: finalRows,
    rowDiffs,
    stats,
    duplicatesRemovedList,
    removedEmptyRowsCount,
    removedEmptyColsCount,
  };
}
