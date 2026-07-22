import React from 'react';
import {
  Sparkles,
  ShieldCheck,
  FileSpreadsheet,
  Download,
  RotateCcw,
  FileUp,
  Sliders,
  Database,
  WifiOff,
} from 'lucide-react';
import { FileFormat } from '../types';

interface HeaderProps {
  fileName?: string;
  fileFormat?: FileFormat;
  totalRows?: number;
  onReset: () => void;
  onExport: () => void;
  onLoadSample: (index: number) => void;
  isCleaningActive: boolean;
  onToggleControls: () => void;
  showControls: boolean;
  onOpenOfflineGuide?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  fileName,
  fileFormat,
  totalRows,
  onReset,
  onExport,
  onLoadSample,
  isCleaningActive,
  onToggleControls,
  showControls,
  onOpenOfflineGuide,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 text-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Logo & Title */}
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold italic text-xl shadow-sm">
            D
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold tracking-tight text-slate-800">
                SheetCleaner <span className="text-blue-600">Pro</span>
              </h1>
              <button
                onClick={onOpenOfflineGuide}
                title="Click for Offline & Security Guide"
                className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold bg-green-100 text-green-700 border border-green-200 px-2.5 py-0.5 rounded-md uppercase tracking-wider hover:bg-green-200 transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-green-700" />
                Offline Mode Active
              </button>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Sanitize, deduplicate & format sheets instantly
            </p>
          </div>
        </div>

        {/* Center File Info Badge */}
        {fileName && (
          <div className="hidden md:flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs">
            <span className="font-semibold text-slate-700 max-w-[180px] truncate">
              {fileName}
            </span>
            {fileFormat && (
              <span className="uppercase text-[10px] bg-blue-100 text-blue-700 font-bold px-1.5 py-0.5 rounded">
                .{fileFormat}
              </span>
            )}
            {totalRows !== undefined && (
              <span className="text-slate-500 border-l border-slate-200 pl-2">
                {totalRows.toLocaleString()} rows
              </span>
            )}
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center space-x-2">
          {isCleaningActive ? (
            <>
              <button
                onClick={onToggleControls}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                  showControls
                    ? 'bg-blue-50 text-blue-700 border-blue-300'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Sliders className="w-3.5 h-3.5 text-blue-600" />
                <span>Fine-Tune Rules</span>
              </button>

              <button
                onClick={onReset}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-all"
                title="Upload another file"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden sm:inline">New Sheet</span>
              </button>

              <button
                onClick={onExport}
                className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all transform active:scale-95"
              >
                <Download className="w-4 h-4" />
                <span>Export Clean Sheet</span>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenOfflineGuide}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-sm transition-all"
                title="How offline processing works"
              >
                <WifiOff className="w-3.5 h-3.5 text-green-600" />
                <span className="hidden sm:inline">Offline Info</span>
              </button>

              <div className="relative group">
                <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-sm transition-all">
                  <Database className="w-3.5 h-3.5 text-blue-600" />
                  <span>Try Sample Data</span>
                </button>
                <div className="absolute right-0 top-full mt-1 w-60 bg-white border border-slate-200 rounded-xl shadow-xl p-1 hidden group-hover:block z-50">
                  <button
                    onClick={() => onLoadSample(0)}
                    className="w-full text-left px-3 py-2 text-xs text-slate-800 hover:bg-slate-100 rounded-lg flex flex-col gap-0.5 transition-colors"
                  >
                    <span className="font-bold text-blue-600">Customer Leads & CRM</span>
                    <span className="text-[10px] text-slate-500">Duplicates, spaces & email cleanup</span>
                  </button>
                  <button
                    onClick={() => onLoadSample(1)}
                    className="w-full text-left px-3 py-2 text-xs text-slate-800 hover:bg-slate-100 rounded-lg flex flex-col gap-0.5 transition-colors"
                  >
                    <span className="font-bold text-green-700">E-Commerce Sales Orders</span>
                    <span className="text-[10px] text-slate-500">Duplicate order IDs & price parsing</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
