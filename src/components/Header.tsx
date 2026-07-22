import React from 'react';
import {
  Download,
  RotateCcw,
  Sliders,
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
          <div className="w-9 h-9 bg-white border border-slate-200 rounded-lg p-1 flex items-center justify-center shadow-sm">
            <img
              src="/logo.svg"
              alt="CleanGrid Solutions AI"
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold tracking-tight text-slate-800">
                CleanGrid Solutions <span className="text-blue-600">AI</span>
              </h1>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Intelligent data sanitization, deduplication & automated cleaning
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
          {isCleaningActive && (
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
          )}
        </div>
      </div>
    </header>
  );
};
