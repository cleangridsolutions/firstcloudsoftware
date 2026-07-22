import React, { useState } from 'react';
import { FileFormat } from '../types';
import {
  X,
  Download,
  FileSpreadsheet,
  Check,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalFileName: string;
  originalFormat: FileFormat;
  onExport: (format: FileFormat, customFileName: string) => void;
  totalCleanedRows: number;
  totalFixesCount: number;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  originalFileName,
  originalFormat,
  onExport,
  totalCleanedRows,
  totalFixesCount,
}) => {
  if (!isOpen) return null;

  const baseName = originalFileName.replace(/\.[^/.]+$/, '');
  const [selectedFormat, setSelectedFormat] = useState<FileFormat>(originalFormat || 'xlsx');
  const [fileName, setFileName] = useState(`${baseName}_cleaned`);

  const handleDownload = () => {
    onExport(selectedFormat, fileName);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full shadow-2xl p-6 space-y-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 p-1 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-blue-600 text-white shadow-sm">
            <Download className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">
              Export Cleaned Spreadsheet
            </h3>
            <p className="text-xs text-slate-500">
              Matches your original format <code className="text-blue-600 font-bold">.{originalFormat}</code>
            </p>
          </div>
        </div>

        {/* Cleaned Summary Stats Pill */}
        <div className="p-3 rounded-xl bg-green-50 border border-green-200 text-xs text-green-800 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span>Ready for instant download</span>
          </div>
          <span className="font-bold text-slate-800">{totalCleanedRows} Rows • {totalFixesCount} Fixes</span>
        </div>

        {/* File Name Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">
            Output File Name:
          </label>
          <div className="flex items-center rounded-xl bg-slate-50 border border-slate-200 px-3 py-2 text-xs focus-within:border-blue-500">
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="bg-transparent w-full text-slate-800 font-semibold focus:outline-none"
            />
            <span className="text-slate-500 font-bold uppercase pl-2">
              .{selectedFormat}
            </span>
          </div>
        </div>

        {/* Format Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700">
            Select Export Format:
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'xlsx', label: 'Excel Worksheet (.xlsx)', desc: 'Best for Microsoft Excel & Google Sheets' },
              { id: 'csv', label: 'CSV File (.csv)', desc: 'Universal comma-separated text' },
              { id: 'xls', label: 'Legacy Excel (.xls)', desc: 'Excel 97-2003 format' },
              { id: 'tsv', label: 'TSV File (.tsv)', desc: 'Tab-separated values' },
            ].map((fmt) => (
              <button
                key={fmt.id}
                type="button"
                onClick={() => setSelectedFormat(fmt.id as FileFormat)}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col gap-0.5 ${
                  selectedFormat === fmt.id
                    ? 'bg-blue-50 text-blue-800 border-blue-400 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-bold">{fmt.label}</span>
                  {selectedFormat === fmt.id && (
                    <Check className="w-3.5 h-3.5 text-blue-600" />
                  )}
                </div>
                <span className="text-[10px] text-slate-500 font-medium">{fmt.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleDownload}
          className="w-full py-3 px-4 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          <Download className="w-4 h-4" />
          <span>Download Cleaned File (.{selectedFormat})</span>
        </button>
      </div>
    </div>
  );
};
