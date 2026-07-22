import React, { useState, useMemo } from 'react';
import {
  CleaningOptions,
  SheetData,
  FileFormat,
} from './types';
import { cleanSheetData } from './utils/cleaner';
import { parseSpreadsheetFile, exportSpreadsheetFile } from './utils/fileHandler';
import { SAMPLE_DATASETS } from './data/sampleDatasets';
import { Header } from './components/Header';
import { FileDropzone } from './components/FileDropzone';
import { StatsBanner } from './components/StatsBanner';
import { CleaningControls } from './components/CleaningControls';
import { DataGrid } from './components/DataGrid';
import { ExportModal } from './components/ExportModal';
import { OfflineGuideModal } from './components/OfflineGuideModal';
import { Sparkles, Sliders, CheckCircle2 } from 'lucide-react';
import { SpeedInsights } from '@vercel/speed-insights/react';

const DEFAULT_CLEANING_OPTIONS: CleaningOptions = {
  removeDuplicates: true,
  duplicateKeyColumns: [], // empty = exact full row match

  trimWhitespace: true,
  removeInvisibleChars: true,
  collapseMultipleSpaces: true,

  headerCasing: 'title',
  cleanHeaderNames: true,

  autoDetectSmartCasing: true,
  sanitizeEmails: true,
  formatPhoneNumbers: true,

  standardizeDates: true,
  dateFormat: 'YYYY-MM-DD',
  standardizeNumbers: true,

  removeEmptyRows: true,
  removeEmptyCols: true,
  handleMissingValues: true,
  missingValueReplacement: '',

  enableFindReplace: false,
  findText: '',
  replaceText: '',
  findReplaceColumn: 'all',
};

export default function App() {
  const [activeSheet, setActiveSheet] = useState<SheetData | null>(null);
  const [cleaningOptions, setCleaningOptions] = useState<CleaningOptions>(DEFAULT_CLEANING_OPTIONS);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showControls, setShowControls] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showOfflineGuide, setShowOfflineGuide] = useState(false);

  // File upload handler
  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const parsed = await parseSpreadsheetFile(file);
      if (parsed.sheets.length > 0) {
        setActiveSheet(parsed.sheets[0]);
        setShowControls(false);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to read spreadsheet file');
    } finally {
      setIsLoading(false);
    }
  };

  // Sample loader
  const handleLoadSample = (index: number) => {
    const sample = SAMPLE_DATASETS[index] || SAMPLE_DATASETS[0];
    setActiveSheet(sample);
    setShowControls(false);
    setErrorMessage(null);
  };

  // Reset workspace
  const handleReset = () => {
    setActiveSheet(null);
    setCleaningOptions(DEFAULT_CLEANING_OPTIONS);
    setShowControls(false);
    setShowExportModal(false);
    setErrorMessage(null);
  };

  // Run Cleaning Engine
  const cleaningResult = useMemo(() => {
    if (!activeSheet) return null;
    return cleanSheetData(
      activeSheet.headers,
      activeSheet.rows,
      cleaningOptions
    );
  }, [activeSheet, cleaningOptions]);

  // Handle Export
  const handleExport = (exportFormat: FileFormat, customFileName: string) => {
    if (!activeSheet || !cleaningResult) return;
    exportSpreadsheetFile(
      cleaningResult.cleanedHeaders,
      cleaningResult.cleanedRows,
      exportFormat,
      customFileName,
      activeSheet.sheetName
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans antialiased selection:bg-blue-500 selection:text-white">
      {/* Top Application Header */}
      <Header
        fileName={activeSheet?.fileName}
        fileFormat={activeSheet?.fileFormat}
        totalRows={activeSheet?.rows.length}
        onReset={handleReset}
        onExport={() => setShowExportModal(true)}
        onLoadSample={handleLoadSample}
        isCleaningActive={!!activeSheet}
        onToggleControls={() => setShowControls((prev) => !prev)}
        showControls={showControls}
        onOpenOfflineGuide={() => setShowOfflineGuide(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {!activeSheet ? (
          <FileDropzone
            onFileUpload={handleFileUpload}
            onLoadSample={handleLoadSample}
            isLoading={isLoading}
            errorMessage={errorMessage}
          />
        ) : (
          cleaningResult && (
            <div className="space-y-6 animate-fade-in">
              {/* Data Health Stats Banner */}
              <StatsBanner stats={cleaningResult.stats} />

              {/* Collapsible Rule Customization Controls */}
              {showControls && (
                <CleaningControls
                  options={cleaningOptions}
                  onChange={setCleaningOptions}
                  headers={cleaningResult.cleanedHeaders}
                  onResetDefault={() => setCleaningOptions(DEFAULT_CLEANING_OPTIONS)}
                />
              )}

              {/* Main Interactive Spreadsheet Grid */}
              <DataGrid
                headers={cleaningResult.cleanedHeaders}
                cleanedRows={cleaningResult.cleanedRows}
                originalHeaders={activeSheet.headers}
                originalRows={activeSheet.rows}
                rowDiffs={cleaningResult.rowDiffs}
                duplicatesRemovedList={cleaningResult.duplicatesRemovedList}
                stats={cleaningResult.stats}
              />
            </div>
          )
        )}
      </main>

      {/* Export Modal Dialog */}
      {activeSheet && cleaningResult && (
        <ExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          originalFileName={activeSheet.fileName}
          originalFormat={activeSheet.fileFormat}
          onExport={handleExport}
          totalCleanedRows={cleaningResult.stats.finalRows}
          totalFixesCount={cleaningResult.stats.totalChanges}
        />
      )}

      {/* Offline & Security Guide Modal */}
      <OfflineGuideModal
        isOpen={showOfflineGuide}
        onClose={() => setShowOfflineGuide(false)}
      />

      {/* Footer Disclaimer */}
      <footer className="border-t border-slate-200 bg-white py-3 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            CleanGrid Solutions AI • Professional Offline Data Sanitization
          </span>
          <button
            onClick={() => setShowOfflineGuide(true)}
            className="flex items-center gap-1.5 font-semibold text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
            <span>100% Client-Side Local Processing (Click for info)</span>
          </button>
        </div>
      </footer>
      <SpeedInsights />
    </div>
  );
}
