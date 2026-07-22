import React, { useRef, useState } from 'react';
import {
  Upload,
  Sparkles,
  CheckCircle2,
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
        <div className="flex flex-wrap items-center justify-center gap-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-200 text-xs font-bold shadow-sm">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span>🟢 AI Powered ⭐</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold tracking-wider shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>AI-Powered Fastest Data Cleaning</span>
          </div>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Get Clean Sheets/Data in Seconds
        </h2>
        <p className="text-sm text-slate-600 max-w-2xl mx-auto">
          Drop your Excel (.xlsx, .xls), CSV, TSV, or ODS spreadsheet file. Automatically remove duplicates, standardize phone numbers, fix formatting, and export sanitized data instantly.
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
                : 'Upload Your Lead File or drag & drop here'}
            </p>
            <p className="text-xs text-slate-500">
              Supports <span className="text-slate-800 font-semibold">.XLSX, .XLS, .CSV, .TSV, .ODS</span> and exported Google Sheets
            </p>
          </div>

          {/* Privacy & Security Tag */}
          <div className="pt-2 flex items-center gap-2 text-xs text-slate-700 font-semibold bg-slate-100 border border-slate-200 px-3.5 py-1 rounded-full shadow-sm">
            <span>🔒 Your data stays private. Files are never stored permanently.</span>
          </div>
        </div>

        {errorMessage && (
          <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
            {errorMessage}
          </div>
        )}
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
