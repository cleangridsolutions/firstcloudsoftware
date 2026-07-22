import React from 'react';
import {
  X,
  ShieldCheck,
  Download,
  WifiOff,
  HardDrive,
  FileSpreadsheet,
  CheckCircle2,
  Lock,
} from 'lucide-react';

interface OfflineGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OfflineGuideModal: React.FC<OfflineGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white border border-slate-200 rounded-xl max-w-xl w-full shadow-2xl p-6 space-y-6 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-green-50 text-green-700 border border-green-200 shadow-sm">
            <WifiOff className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-800">
                100% Offline Processing & Local Saving
              </h3>
              <span className="text-[10px] bg-green-100 text-green-800 font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                Active
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Zero server uploads • Private in-memory client engine
            </p>
          </div>
        </div>

        {/* Highlight Shield */}
        <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 space-y-1">
          <div className="flex items-center gap-1.5 font-bold">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>How Your Data Stays Completely Private</span>
          </div>
          <p className="text-slate-600 leading-relaxed text-[11px]">
            CleanGrid Solutions AI processes all spreadsheet rows, regex transformations, and file encodings locally in your Web Browser memory (RAM). No data is sent to any external server or API.
          </p>
        </div>

        {/* Section 1: How to Save Files Locally */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <Download className="w-4 h-4 text-blue-600" />
            <span>Step-by-Step: How to Clean & Save Files Offline</span>
          </h4>
          <ol className="space-y-2.5 text-xs text-slate-700">
            <li className="flex items-start gap-2.5 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[11px] shrink-0">
                1
              </span>
              <div>
                <strong className="text-slate-800 block">Upload or Drag Your File</strong>
                Drop any <code className="text-blue-700 font-mono font-bold bg-blue-50 px-1 rounded">.xlsx</code>, <code className="text-blue-700 font-mono font-bold bg-blue-50 px-1 rounded">.csv</code>, or <code className="text-blue-700 font-mono font-bold bg-blue-50 px-1 rounded">.tsv</code> spreadsheet. The browser reads it instantly via in-memory HTML5 File APIs.
              </div>
            </li>
            <li className="flex items-start gap-2.5 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[11px] shrink-0">
                2
              </span>
              <div>
                <strong className="text-slate-800 block">Fine-Tune Cleaning Rules</strong>
                Toggle deduplication, whitespace trimming, date standardization, and smart casing. Review live changes highlighted in the interactive grid.
              </div>
            </li>
            <li className="flex items-start gap-2.5 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[11px] shrink-0">
                3
              </span>
              <div>
                <strong className="text-slate-800 block">Click "Export Clean Sheet"</strong>
                Choose your preferred export format (<code className="text-slate-800 font-semibold">Excel .xlsx</code>, <code className="text-slate-800 font-semibold">CSV</code>, or <code className="text-slate-800 font-semibold">TSV</code>) and download directly to your computer's local Downloads directory.
              </div>
            </li>
          </ol>
        </div>

        {/* Section 2: How to Use Without Internet */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <HardDrive className="w-4 h-4 text-green-600" />
            <span>Using the App Without Internet Access</span>
          </h4>
          <div className="space-y-2 text-xs text-slate-600">
            <div className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
              <span>
                <strong>Keep the Tab Open:</strong> All JavaScript logic is already loaded in your browser memory. You can turn off Wi-Fi or go offline and continue processing unlimited files.
              </span>
            </div>
            <div className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
              <span>
                <strong>Bookmark for Fast Access:</strong> Simply bookmark the URL in Chrome, Edge, Safari, or Firefox to launch CleanGrid Solutions AI anytime.
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-2 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-all"
          >
            Got it, Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
