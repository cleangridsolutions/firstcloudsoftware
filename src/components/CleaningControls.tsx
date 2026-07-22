import React from 'react';
import {
  CleaningOptions,
  HeaderCasing,
  DateFormatOption,
} from '../types';
import {
  Copy,
  Space,
  Type,
  Calendar,
  Layers,
  Search,
  Check,
  ChevronDown,
  RotateCcw,
} from 'lucide-react';

interface CleaningControlsProps {
  options: CleaningOptions;
  onChange: (newOptions: CleaningOptions) => void;
  headers: string[];
  onResetDefault: () => void;
}

export const CleaningControls: React.FC<CleaningControlsProps> = ({
  options,
  onChange,
  headers,
  onResetDefault,
}) => {
  const updateOption = <K extends keyof CleaningOptions>(
    key: K,
    value: CleaningOptions[K]
  ) => {
    onChange({
      ...options,
      [key]: value,
    });
  };

  const toggleKeyColumn = (colName: string) => {
    const current = options.duplicateKeyColumns;
    if (current.includes(colName)) {
      updateOption(
        'duplicateKeyColumns',
        current.filter((c) => c !== colName)
      );
    } else {
      updateOption('duplicateKeyColumns', [...current, colName]);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
          <span>Cleaning Rules & Customization</span>
        </h3>
        <button
          onClick={onResetDefault}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg border border-slate-200 transition-all"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset Rules</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Section 1: Duplicates */}
        <div className="space-y-3 bg-slate-50/80 p-4 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Copy className="w-4 h-4 text-red-600" />
              <span>Deduplication</span>
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={options.removeDuplicates}
                onChange={(e) => updateOption('removeDuplicates', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {options.removeDuplicates && (
            <div className="space-y-2 pt-2 border-t border-slate-200">
              <span className="text-[11px] text-slate-500 font-semibold">
                Match duplicates based on:
              </span>
              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1">
                <button
                  type="button"
                  onClick={() => updateOption('duplicateKeyColumns', [])}
                  className={`text-[11px] px-2 py-0.5 rounded-md border font-semibold transition-all ${
                    options.duplicateKeyColumns.length === 0
                      ? 'bg-red-50 text-red-700 border-red-300'
                      : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900'
                  }`}
                >
                  Full Row (Exact match)
                </button>

                {headers.map((h) => {
                  const isSelected = options.duplicateKeyColumns.includes(h);
                  return (
                    <button
                      key={h}
                      type="button"
                      onClick={() => toggleKeyColumn(h)}
                      className={`text-[11px] px-2 py-0.5 rounded-md border font-semibold transition-all ${
                        isSelected
                          ? 'bg-red-50 text-red-700 border-red-300'
                          : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900'
                      }`}
                    >
                      {h}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Section 2: Whitespace & Text */}
        <div className="space-y-3 bg-slate-50/80 p-4 rounded-xl border border-slate-200">
          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Space className="w-4 h-4 text-amber-600" />
            <span>Whitespace & Invisible Chars</span>
          </span>

          <div className="space-y-2 text-xs text-slate-700 font-medium">
            <label className="flex items-center gap-2 cursor-pointer hover:text-slate-900">
              <input
                type="checkbox"
                checked={options.trimWhitespace}
                onChange={(e) => updateOption('trimWhitespace', e.target.checked)}
                className="rounded bg-white border-slate-300 text-blue-600 focus:ring-0"
              />
              <span>Trim leading & trailing spaces</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer hover:text-slate-900">
              <input
                type="checkbox"
                checked={options.removeInvisibleChars}
                onChange={(e) => updateOption('removeInvisibleChars', e.target.checked)}
                className="rounded bg-white border-slate-300 text-blue-600 focus:ring-0"
              />
              <span>Remove zero-width & non-breaking spaces</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer hover:text-slate-900">
              <input
                type="checkbox"
                checked={options.collapseMultipleSpaces}
                onChange={(e) => updateOption('collapseMultipleSpaces', e.target.checked)}
                className="rounded bg-white border-slate-300 text-blue-600 focus:ring-0"
              />
              <span>Collapse double spaces into single space</span>
            </label>
          </div>
        </div>

        {/* Section 3: Smart Casing & Formatting */}
        <div className="space-y-3 bg-slate-50/80 p-4 rounded-xl border border-slate-200">
          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Type className="w-4 h-4 text-blue-600" />
            <span>Smart Casing & Contacts</span>
          </span>

          <div className="space-y-2 text-xs text-slate-700 font-medium">
            <label className="flex items-center gap-2 cursor-pointer hover:text-slate-900">
              <input
                type="checkbox"
                checked={options.autoDetectSmartCasing}
                onChange={(e) => updateOption('autoDetectSmartCasing', e.target.checked)}
                className="rounded bg-white border-slate-300 text-blue-600 focus:ring-0"
              />
              <span>Capitalize Names, Cities & Companies</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer hover:text-slate-900">
              <input
                type="checkbox"
                checked={options.sanitizeEmails}
                onChange={(e) => updateOption('sanitizeEmails', e.target.checked)}
                className="rounded bg-white border-slate-300 text-blue-600 focus:ring-0"
              />
              <span>Lowercase & clean email addresses</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer hover:text-slate-900">
              <input
                type="checkbox"
                checked={options.formatPhoneNumbers}
                onChange={(e) => updateOption('formatPhoneNumbers', e.target.checked)}
                className="rounded bg-white border-slate-300 text-blue-600 focus:ring-0"
              />
              <span>Standardize phone numbers <code className="text-[10px] text-blue-600 font-mono">(XXX) XXX-XXXX</code></span>
            </label>
          </div>
        </div>

        {/* Section 4: Headers */}
        <div className="space-y-3 bg-slate-50/80 p-4 rounded-xl border border-slate-200">
          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Type className="w-4 h-4 text-indigo-600" />
            <span>Header Standardization</span>
          </span>

          <div className="space-y-2 text-xs text-slate-700 font-medium">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-semibold">Header Casing:</span>
              <select
                value={options.headerCasing}
                onChange={(e) => updateOption('headerCasing', e.target.value as HeaderCasing)}
                className="bg-white border border-slate-300 text-slate-800 text-xs rounded-lg px-2 py-1 font-semibold focus:ring-0 focus:border-blue-500"
              >
                <option value="none">Original Casing</option>
                <option value="title">Title Case (First Name)</option>
                <option value="snake">snake_case (first_name)</option>
                <option value="camel">camelCase (firstName)</option>
                <option value="upper">UPPERCASE (FIRST NAME)</option>
                <option value="lower">lowercase (first name)</option>
              </select>
            </div>

            <label className="flex items-center gap-2 cursor-pointer hover:text-slate-900 pt-1">
              <input
                type="checkbox"
                checked={options.cleanHeaderNames}
                onChange={(e) => updateOption('cleanHeaderNames', e.target.checked)}
                className="rounded bg-white border-slate-300 text-blue-600 focus:ring-0"
              />
              <span>Strip symbols (#, $, !) from headers</span>
            </label>
          </div>
        </div>

        {/* Section 5: Dates & Numbers */}
        <div className="space-y-3 bg-slate-50/80 p-4 rounded-xl border border-slate-200">
          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-cyan-600" />
            <span>Dates & Numeric Formatting</span>
          </span>

          <div className="space-y-2 text-xs text-slate-700 font-medium">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer hover:text-slate-900">
                <input
                  type="checkbox"
                  checked={options.standardizeDates}
                  onChange={(e) => updateOption('standardizeDates', e.target.checked)}
                  className="rounded bg-white border-slate-300 text-blue-600 focus:ring-0"
                />
                <span>Standardize Dates</span>
              </label>

              {options.standardizeDates && (
                <select
                  value={options.dateFormat}
                  onChange={(e) => updateOption('dateFormat', e.target.value as DateFormatOption)}
                  className="bg-white border border-slate-300 text-slate-800 text-xs rounded-lg px-2 py-0.5 font-semibold focus:ring-0 focus:border-blue-500"
                >
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="MMM DD, YYYY">MMM DD, YYYY</option>
                </select>
              )}
            </div>

            <label className="flex items-center gap-2 cursor-pointer hover:text-slate-900">
              <input
                type="checkbox"
                checked={options.standardizeNumbers}
                onChange={(e) => updateOption('standardizeNumbers', e.target.checked)}
                className="rounded bg-white border-slate-300 text-blue-600 focus:ring-0"
              />
              <span>Parse currency & numbers <code className="text-[10px] text-cyan-700 font-mono">"$1,250.00" → 1250</code></span>
            </label>
          </div>
        </div>

        {/* Section 6: Missing Values & Empty Rows */}
        <div className="space-y-3 bg-slate-50/80 p-4 rounded-xl border border-slate-200">
          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-green-600" />
            <span>Missing & Blank Cells</span>
          </span>

          <div className="space-y-2 text-xs text-slate-700 font-medium">
            <label className="flex items-center gap-2 cursor-pointer hover:text-slate-900">
              <input
                type="checkbox"
                checked={options.removeEmptyRows}
                onChange={(e) => updateOption('removeEmptyRows', e.target.checked)}
                className="rounded bg-white border-slate-300 text-blue-600 focus:ring-0"
              />
              <span>Remove totally blank rows</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer hover:text-slate-900">
              <input
                type="checkbox"
                checked={options.removeEmptyCols}
                onChange={(e) => updateOption('removeEmptyCols', e.target.checked)}
                className="rounded bg-white border-slate-300 text-blue-600 focus:ring-0"
              />
              <span>Remove empty columns with no data</span>
            </label>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer hover:text-slate-900">
                <input
                  type="checkbox"
                  checked={options.handleMissingValues}
                  onChange={(e) => updateOption('handleMissingValues', e.target.checked)}
                  className="rounded bg-white border-slate-300 text-blue-600 focus:ring-0"
                />
                <span>Standardize N/A / Nulls</span>
              </label>

              {options.handleMissingValues && (
                <input
                  type="text"
                  placeholder='Replacement (e.g. "")'
                  value={options.missingValueReplacement}
                  onChange={(e) => updateOption('missingValueReplacement', e.target.value)}
                  className="w-28 bg-white border border-slate-300 text-slate-800 text-xs rounded-lg px-2 py-0.5 focus:border-blue-500 font-medium"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
