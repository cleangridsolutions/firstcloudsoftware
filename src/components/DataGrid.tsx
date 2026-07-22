import React, { useState, useMemo } from 'react';
import {
  RowDiff,
  DuplicateRecord,
  CleaningStats,
} from '../types';
import {
  Search,
  CheckCircle2,
  Copy,
  Table as TableIcon,
  AlertCircle,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Filter,
  Eye,
  Info,
} from 'lucide-react';

interface DataGridProps {
  headers: string[];
  cleanedRows: Record<string, any>[];
  originalHeaders: string[];
  originalRows: Record<string, any>[];
  rowDiffs: RowDiff[];
  duplicatesRemovedList: DuplicateRecord[];
  stats: CleaningStats;
}

export const DataGrid: React.FC<DataGridProps> = ({
  headers,
  cleanedRows,
  originalHeaders,
  originalRows,
  rowDiffs,
  duplicatesRemovedList,
  stats,
}) => {
  const [activeTab, setActiveTab] = useState<'cleaned' | 'original' | 'duplicates' | 'columns'>('cleaned');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [showOnlyChangedRows, setShowOnlyChangedRows] = useState(false);

  // Handle Sort
  const handleSort = (col: string) => {
    if (sortColumn === col) {
      if (sortDirection === 'asc') setSortDirection('desc');
      else setSortColumn(null);
    } else {
      setSortColumn(col);
      setSortDirection('asc');
    }
  };

  // Filter & Sort Cleaned Rows
  const filteredRowDiffs = useMemo(() => {
    let list = rowDiffs;

    if (showOnlyChangedRows) {
      list = list.filter((rd) => rd.isChanged);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((rd) =>
        headers.some((h) => String(rd.cleanedRow[h] ?? '').toLowerCase().includes(q))
      );
    }

    if (sortColumn) {
      list = [...list].sort((a, b) => {
        const valA = a.cleanedRow[sortColumn] ?? '';
        const valB = b.cleanedRow[sortColumn] ?? '';

        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortDirection === 'asc' ? valA - valB : valB - valA;
        }

        const strA = String(valA).toLowerCase();
        const strB = String(valB).toLowerCase();
        if (strA < strB) return sortDirection === 'asc' ? -1 : 1;
        if (strA > strB) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return list;
  }, [rowDiffs, headers, searchQuery, sortColumn, sortDirection, showOnlyChangedRows]);

  // Paginated Rows
  const totalPages = Math.ceil(filteredRowDiffs.length / pageSize) || 1;
  const paginatedDiffs = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRowDiffs.slice(start, start + pageSize);
  }, [filteredRowDiffs, currentPage, pageSize]);

  // Column Analysis Stats
  const columnAnalysis = useMemo(() => {
    return headers.map((col) => {
      let missingCount = 0;
      const uniqueValues = new Set<string>();
      let isNumericColumn = true;

      cleanedRows.forEach((row) => {
        const val = row[col];
        if (val === null || val === undefined || val === '') {
          missingCount++;
        } else {
          uniqueValues.add(String(val));
          if (typeof val !== 'number' && isNaN(Number(val))) {
            isNumericColumn = false;
          }
        }
      });

      const total = cleanedRows.length || 1;
      const fillRate = Math.round(((total - missingCount) / total) * 100);

      return {
        columnName: col,
        missingCount,
        fillRate,
        uniqueCount: uniqueValues.size,
        type: isNumericColumn ? 'Numeric' : 'Text / String',
      };
    });
  }, [headers, cleanedRows]);

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
      {/* Top Navigation Tabs & Controls */}
      <div className="p-3 sm:p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        {/* Tabs */}
        <div className="flex items-center gap-1 bg-slate-200/60 p-1 rounded-xl border border-slate-300">
          <button
            onClick={() => {
              setActiveTab('cleaned');
              setCurrentPage(1);
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'cleaned'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
            <span>Cleaned Data</span>
            <span className="ml-1 text-[10px] bg-blue-800 text-white font-extrabold px-1.5 py-0.2 rounded-full">
              {cleanedRows.length}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab('original');
              setCurrentPage(1);
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'original'
                ? 'bg-white text-slate-800 border border-slate-200 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span>Original Upload</span>
            <span className="ml-1 text-[10px] bg-slate-200 text-slate-700 font-extrabold px-1.5 py-0.2 rounded-full">
              {originalRows.length}
            </span>
          </button>

          {duplicatesRemovedList.length > 0 && (
            <button
              onClick={() => {
                setActiveTab('duplicates');
                setCurrentPage(1);
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'duplicates'
                  ? 'bg-red-50 text-red-700 border border-red-200 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              <Copy className="w-3.5 h-3.5 text-red-600" />
              <span>Removed Duplicates</span>
              <span className="ml-1 text-[10px] bg-red-100 text-red-800 font-extrabold px-1.5 py-0.2 rounded-full">
                {duplicatesRemovedList.length}
              </span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('columns')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'columns'
                ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
            <span>Column Health</span>
          </button>
        </div>

        {/* Right Search & Filter Bar (Only for cleaned tab) */}
        {activeTab === 'cleaned' && (
          <div className="flex items-center gap-2 flex-grow sm:flex-grow-0">
            <label className="flex items-center gap-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 cursor-pointer shadow-sm">
              <input
                type="checkbox"
                checked={showOnlyChangedRows}
                onChange={(e) => {
                  setShowOnlyChangedRows(e.target.checked);
                  setCurrentPage(1);
                }}
                className="rounded bg-white border-slate-300 text-blue-600 focus:ring-0"
              />
              <span>Show Modified Rows Only ({rowDiffs.filter((r) => r.isChanged).length})</span>
            </label>

            <div className="relative flex-grow sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search across sheet..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 shadow-sm font-medium"
              />
            </div>
          </div>
        )}
      </div>

      {/* Main Table Content View */}
      <div className="overflow-x-auto min-h-[350px] max-h-[500px]">
        {activeTab === 'cleaned' && (
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-100 text-slate-700 sticky top-0 z-10 border-b border-slate-200 uppercase font-bold text-[11px] tracking-wider">
              <tr>
                <th className="py-2.5 px-3 font-bold text-slate-500 w-12 text-center border-r border-slate-200">
                  #
                </th>
                {headers.map((header) => (
                  <th
                    key={header}
                    onClick={() => handleSort(header)}
                    className="py-2.5 px-3 font-bold text-slate-700 border-r border-slate-200 cursor-pointer hover:bg-slate-200/60 transition-colors whitespace-nowrap"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span>{header}</span>
                      <ArrowUpDown className="w-3 h-3 text-slate-400" />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800">
              {paginatedDiffs.length === 0 ? (
                <tr>
                  <td colSpan={headers.length + 1} className="py-12 text-center text-slate-500 font-medium">
                    No rows match your search criteria.
                  </td>
                </tr>
              ) : (
                paginatedDiffs.map((rowDiff, idx) => {
                  const globalRowIdx = (currentPage - 1) * pageSize + idx + 1;
                  return (
                    <tr
                      key={idx}
                      className={`hover:bg-slate-50 transition-colors ${
                        rowDiff.isChanged ? 'bg-blue-50/40' : ''
                      }`}
                    >
                      <td className="py-2 px-3 text-center text-slate-500 font-mono text-[11px] border-r border-slate-200 bg-slate-50/80 font-semibold">
                        {globalRowIdx}
                      </td>
                      {headers.map((header) => {
                        const cellDiff = rowDiff.diffs[header];
                        const val = rowDiff.cleanedRow[header];
                        const isChanged = cellDiff && cellDiff.type !== 'none';

                        let cellClass = '';
                        if (isChanged) {
                          cellClass = 'bg-blue-100/70 text-blue-900 font-semibold';
                        }

                        return (
                          <td
                            key={header}
                            className={`py-2 px-3 border-r border-slate-200 whitespace-nowrap max-w-xs truncate ${cellClass}`}
                            title={
                              isChanged
                                ? `Original: "${cellDiff.originalValue}" ➔ Cleaned: "${cellDiff.newValue}"`
                                : String(val ?? '')
                            }
                          >
                            <div className="flex items-center justify-between gap-1">
                              <span>{val === '' ? <span className="text-slate-400 italic">&lt;empty&gt;</span> : String(val ?? '')}</span>
                              {isChanged && (
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}

        {activeTab === 'original' && (
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-100 text-slate-700 sticky top-0 z-10 border-b border-slate-200 uppercase font-bold text-[11px] tracking-wider">
              <tr>
                <th className="py-2.5 px-3 font-bold text-slate-500 w-12 text-center border-r border-slate-200">
                  #
                </th>
                {originalHeaders.map((header) => (
                  <th key={header} className="py-2.5 px-3 font-bold text-slate-700 border-r border-slate-200 whitespace-nowrap">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800">
              {originalRows.slice(0, 100).map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="py-2 px-3 text-center text-slate-500 font-mono text-[11px] border-r border-slate-200 bg-slate-50/80 font-semibold">
                    {idx + 1}
                  </td>
                  {originalHeaders.map((header) => (
                    <td key={header} className="py-2 px-3 border-r border-slate-200 whitespace-nowrap max-w-xs truncate">
                      {String(row[header] ?? '')}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {activeTab === 'duplicates' && (
          <div className="p-4">
            <div className="mb-3 text-xs text-red-700 font-semibold flex items-center gap-1.5 bg-red-50 border border-red-200 p-2.5 rounded-xl">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span>
                The following {duplicatesRemovedList.length} duplicate rows were identified and removed from the output sheet:
              </span>
            </div>
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-100 text-slate-700 border-b border-slate-200 uppercase font-bold text-[11px]">
                <tr>
                  <th className="py-2.5 px-3 font-bold text-slate-500 w-12 text-center">Row</th>
                  {headers.map((h) => (
                    <th key={h} className="py-2.5 px-3 font-bold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-800">
                {duplicatesRemovedList.map((dup, idx) => (
                  <tr key={idx} className="bg-red-50/60 hover:bg-red-50">
                    <td className="py-2 px-3 text-center text-red-700 font-mono text-[11px] font-bold">
                      {dup.originalIndex + 1}
                    </td>
                    {headers.map((h) => (
                      <td key={h} className="py-2 px-3 whitespace-nowrap truncate max-w-xs">
                        {String(dup.row[h] ?? '')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'columns' && (
          <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {columnAnalysis.map((col) => (
              <div
                key={col.columnName}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 text-xs truncate max-w-[180px]">
                    {col.columnName}
                  </span>
                  <span className="text-[10px] bg-white text-blue-700 border border-blue-200 px-2 py-0.5 rounded font-mono font-bold">
                    {col.type}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500 font-medium">Data Completeness:</span>
                    <span className="font-bold text-green-700">{col.fillRate}% filled</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-green-600 h-full rounded-full transition-all"
                      style={{ width: `${col.fillRate}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-600 font-medium pt-1 border-t border-slate-200">
                  <span>Unique Values: <strong className="text-slate-800">{col.uniqueCount}</strong></span>
                  <span>Missing: <strong className="text-slate-800">{col.missingCount}</strong></span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Pagination Bar */}
      {activeTab === 'cleaned' && (
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 font-medium">
          <div>
            Showing <strong className="text-slate-800">{paginatedDiffs.length}</strong> of{' '}
            <strong className="text-slate-800">{filteredRowDiffs.length}</strong> cleaned rows
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center gap-1.5">
              <span>Rows per page:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-white border border-slate-300 text-slate-800 font-semibold rounded px-2 py-0.5 text-xs shadow-sm"
              >
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            <div className="flex items-center space-x-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="p-1 rounded bg-white border border-slate-300 disabled:opacity-40 hover:bg-slate-100 text-slate-700 shadow-sm"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-2 text-slate-700 font-bold">
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="p-1 rounded bg-white border border-slate-300 disabled:opacity-40 hover:bg-slate-100 text-slate-700 shadow-sm"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
