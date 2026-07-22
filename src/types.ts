export type FileFormat = 'xlsx' | 'xls' | 'csv' | 'tsv' | 'ods' | 'txt';

export type HeaderCasing = 'none' | 'title' | 'upper' | 'lower' | 'snake' | 'camel';

export type DateFormatOption = 'YYYY-MM-DD' | 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'MMM DD, YYYY';

export interface CleaningOptions {
  // Duplicates
  removeDuplicates: boolean;
  duplicateKeyColumns: string[]; // empty array = full row comparison

  // Whitespace & Text
  trimWhitespace: boolean;
  removeInvisibleChars: boolean;
  collapseMultipleSpaces: boolean;

  // Headers
  headerCasing: HeaderCasing;
  cleanHeaderNames: boolean; // strip special chars like #, $, ! from headers

  // Casing & Formatting
  autoDetectSmartCasing: boolean; // Capitalize names, lowercase emails
  sanitizeEmails: boolean;
  formatPhoneNumbers: boolean;

  // Dates & Numbers
  standardizeDates: boolean;
  dateFormat: DateFormatOption;
  standardizeNumbers: boolean; // convert "$1,200.50" or "10%" to clean numeric values

  // Empty Data
  removeEmptyRows: boolean;
  removeEmptyCols: boolean;
  handleMissingValues: boolean;
  missingValueReplacement: string; // e.g., "" or "N/A" or "0"

  // Custom Find and Replace
  enableFindReplace: boolean;
  findText: string;
  replaceText: string;
  findReplaceColumn: string; // 'all' or specific column name
}

export interface SheetData {
  sheetName: string;
  headers: string[];
  rows: Record<string, any>[];
  fileName: string;
  fileFormat: FileFormat;
}

export interface CleaningStats {
  initialRows: number;
  initialCols: number;
  finalRows: number;
  finalCols: number;
  duplicatesRemoved: number;
  whitespacesTrimmed: number;
  casingChanges: number;
  datesFormatted: number;
  numbersFormatted: number;
  missingValuesHandled: number;
  emptyRowsRemoved: number;
  emptyColsRemoved: number;
  totalChanges: number;
  healthScore: number;
}

export interface CellDiff {
  originalValue: any;
  newValue: any;
  type: 'whitespace' | 'casing' | 'date' | 'number' | 'missing' | 'custom' | 'none';
}

export interface RowDiff {
  rowIndex: number;
  originalRow: Record<string, any>;
  cleanedRow: Record<string, any>;
  diffs: Record<string, CellDiff>;
  isChanged: boolean;
}

export interface DuplicateRecord {
  originalIndex: number;
  row: Record<string, any>;
  duplicateOfIndex: number;
}
