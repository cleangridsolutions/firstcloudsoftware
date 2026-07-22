import React, { useRef, useState } from 'react';
import {
  FileSpreadsheet,
  Upload,
  Sparkles,
  CheckCircle2,
  FileCode,
  ShieldCheck,
  Zap,
  Flame,
  MousePointerClick,
} from 'lucide-react';

interface FileDropzoneProps {
  onFileUpload: (file: File) => void;
  onLoadSample: (index: number) => void;
  isLoading: boolean;
  errorMessage?: string | null;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({
  onFileUpload,
  onLoadSample,
  isLoading,
  errorMessage,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileUpload(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Hero Welcome Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Offline Smart Spreadsheet Beautifier & Deduplicator</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Clean & Format Spreadsheets in <span className="text-blue-600">One Click</span>
        </h2>
        <p className="text-sm text-slate-600 max-w-2xl mx-auto">
          Drop your Excel (.xlsx, .xls), CSV, TSV, or Google Sheets export file. Automatically remove duplicates, trim extra spaces, format phone numbers, emails, dates, and export back seamlessly.
        </p>
      </div>

      {/* Main Drag and Drop Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center transition-all bg-white shadow-sm ${
          isDragOver
            ? 'border-blue-600 bg-blue-50/50 scale-[1.01]'
            : 'border-slate-300 hover:border-blue-500 hover:bg-slate-50/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls,.csv,.tsv,.ods"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center shadow-sm">
            {isLoading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent" />
            ) : (
              <Upload className="w-8 h-8 text-blue-600 animate-bounce" />
            )}
          </div>

          <div className="space-y-1">
            <p className="text-base font-bold text-slate-800">
              {isLoading
                ? 'Reading & analyzing sheet data...'
                : 'Click to select file or drag & drop here'}
            </p>
            <p className="text-xs text-slate-500">
              Supports <span className="text-slate-800 font-semibold">.XLSX, .XLS, .CSV, .TSV, .ODS</span> and exported Google Sheets
            </p>
          </div>

          {/* Privacy & Security Tag */}
          <div className="pt-2 flex items-center gap-2 text-xs text-green-700 font-semibold bg-green-50 border border-green-200 px-3.5 py-1 rounded-full">
            <ShieldCheck className="w-4 h-4 text-green-600" />
            <span>100% Client-Side Private — Your files never leave your browser</span>
          </div>
        </div>

        {errorMessage && (
          <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
            {errorMessage}
          </div>
        )}
      </div>

      {/* Quick Try Sample Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-bold text-slate-800">
              Don't have a spreadsheet handy? Try a messy sample sheet:
            </h3>
          </div>
          <span className="text-xs font-semibold text-slate-500">Instant 1-Click Clean</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => onLoadSample(0)}
            className="group p-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-blue-400 transition-all text-left flex items-start gap-3 shadow-sm hover:shadow-md"
          >
            <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 group-hover:bg-blue-100 transition-all">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-all">
                  Customer Leads & CRM Sheet
                </span>
                <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-1.5 py-0.5 rounded">
                  .XLSX
                </span>
              </div>
              <p className="text-xs text-slate-600 line-clamp-2">
                Contains duplicate emails, spaces in names like <code className="text-slate-800 bg-slate-100 px-1 rounded">" john smith "</code>, unformatted phone numbers, and inconsistent dates.
              </p>
              <div className="pt-1 flex items-center gap-1 text-[11px] font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
                <MousePointerClick className="w-3 h-3" />
                <span>Test 1-Click Clean →</span>
              </div>
            </div>
          </button>

          <button
            onClick={() => onLoadSample(1)}
            className="group p-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-blue-400 transition-all text-left flex items-start gap-3 shadow-sm hover:shadow-md"
          >
            <div className="p-2.5 rounded-lg bg-green-50 text-green-700 border border-green-200 group-hover:bg-green-100 transition-all">
              <FileCode className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-800 group-hover:text-green-700 transition-all">
                  E-Commerce Sales Orders
                </span>
                <span className="text-[10px] bg-green-100 text-green-800 font-bold px-1.5 py-0.5 rounded">
                  .CSV
                </span>
              </div>
              <p className="text-xs text-slate-600 line-clamp-2">
                Duplicate order numbers, uncleaned column headers like <code className="text-slate-800 bg-slate-100 px-1 rounded">Order ID!</code>, unparsed prices <code className="text-slate-800 bg-slate-100 px-1 rounded">$199.99</code>.
              </p>
              <div className="pt-1 flex items-center gap-1 text-[11px] font-bold text-green-700 group-hover:translate-x-1 transition-transform">
                <MousePointerClick className="w-3 h-3" />
                <span>Test 1-Click Clean →</span>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-200">
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Exact Deduplication</span>
          </div>
          <span className="text-[11px] text-slate-500">Detect & remove duplicate rows or key columns</span>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Trim Whitespace</span>
          </div>
          <span className="text-[11px] text-slate-500">Strip invisible spaces & double tabs</span>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Smart Formatting</span>
          </div>
          <span className="text-[11px] text-slate-500">Capitalize names, fix dates, phone numbers & emails</span>
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
            <span>Original Format Export</span>
          </div>
          <span className="text-[11px] text-slate-500">Seamless download to .XLSX, .CSV, or .TSV</span>
        </div>
      </div>
    </div>
  );
};
