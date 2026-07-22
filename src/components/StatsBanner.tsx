import React from 'react';
import {
  Sparkles,
  Copy,
  Space,
  Type,
  Calendar,
  Layers,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react';
import { CleaningStats } from '../types';

interface StatsBannerProps {
  stats: CleaningStats;
}

export const StatsBanner: React.FC<StatsBannerProps> = ({ stats }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 shadow-sm space-y-4">
      {/* Top Health Score & Summary Line */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-3">
        <div className="flex items-center space-x-3">
          {/* Health Gauge Badge */}
          <div className="relative flex items-center justify-center">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg border shadow-sm ${
                stats.healthScore >= 90
                  ? 'bg-green-50 text-green-700 border-green-200'
                  : stats.healthScore >= 70
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-red-50 text-red-700 border-red-200'
              }`}
            >
              {stats.healthScore}%
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-800">
                Sheet Health Score
              </h3>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                {stats.totalChanges} Fixes Applied
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Rows: <span className="text-slate-800 font-semibold">{stats.initialRows}</span> →{' '}
              <span className="text-green-700 font-bold">{stats.finalRows}</span> ({stats.duplicatesRemoved} duplicates removed)
            </p>
          </div>
        </div>

        {/* Total Cleaned Status Pill */}
        <div className="flex items-center gap-2 bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded-xl text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 text-green-600" />
          <span>Sheet Clean & Ready for Export</span>
        </div>
      </div>

      {/* Grid of Micro-Stat Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {/* Duplicates */}
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center space-x-2.5">
          <div className="p-1.5 rounded-lg bg-red-50 text-red-700 border border-red-200">
            <Copy className="w-4 h-4" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-800">
              {stats.duplicatesRemoved}
            </div>
            <div className="text-[10px] font-medium text-slate-500">Duplicates</div>
          </div>
        </div>

        {/* Whitespace */}
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center space-x-2.5">
          <div className="p-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
            <Space className="w-4 h-4" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-800">
              {stats.whitespacesTrimmed}
            </div>
            <div className="text-[10px] font-medium text-slate-500">Spaces Trimmed</div>
          </div>
        </div>

        {/* Text Casing */}
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center space-x-2.5">
          <div className="p-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
            <Type className="w-4 h-4" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-800">
              {stats.casingChanges}
            </div>
            <div className="text-[10px] font-medium text-slate-500">Casing Fixes</div>
          </div>
        </div>

        {/* Dates */}
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center space-x-2.5">
          <div className="p-1.5 rounded-lg bg-cyan-50 text-cyan-700 border border-cyan-200">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-800">
              {stats.datesFormatted}
            </div>
            <div className="text-[10px] font-medium text-slate-500">Dates Fixes</div>
          </div>
        </div>

        {/* Numbers */}
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center space-x-2.5">
          <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-800">
              {stats.numbersFormatted}
            </div>
            <div className="text-[10px] font-medium text-slate-500">Numbers Cleaned</div>
          </div>
        </div>

        {/* Missing Values */}
        <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center space-x-2.5">
          <div className="p-1.5 rounded-lg bg-green-50 text-green-700 border border-green-200">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="text-sm font-bold text-slate-800">
              {stats.missingValuesHandled}
            </div>
            <div className="text-[10px] font-medium text-slate-500">Nulls Handled</div>
          </div>
        </div>
      </div>
    </div>
  );
};
