import React from 'react';

export function TableRowSkeleton({ columns = 6, height = 'h-12' }) {
  return (
    <tr className="border-b border-sand/40 animate-pulse">
      {Array.from({ length: columns }).map((_, idx) => (
        <td key={idx} className="py-4 px-4 sm:px-6">
          <div
            className={`bg-slate-200/60 rounded-md ${height} ${
              idx === 0
                ? 'w-44'
                : idx === 1
                ? 'w-24'
                : idx === columns - 1
                ? 'w-16 ml-auto'
                : 'w-28'
            }`}
          />
        </td>
      ))}
    </tr>
  );
}

export function TableSkeleton({ rows = 5, columns = 6, height = 'h-5' }) {
  return (
    <tbody className="divide-y divide-sand/40">
      {Array.from({ length: rows }).map((_, rIdx) => (
        <tr key={rIdx} className="animate-pulse">
          {Array.from({ length: columns }).map((_, cIdx) => (
            <td key={cIdx} className="py-4 px-4 sm:px-6">
              <div
                className={`bg-slate-200/60 rounded-md ${height} ${
                  cIdx === 0
                    ? 'w-3/4'
                    : cIdx === columns - 1
                    ? 'w-16 ml-auto'
                    : 'w-1/2'
                }`}
              />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}

export function CardListSkeleton({ count = 4 }) {
  return (
    <div className="divide-y divide-sand/40">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="p-4 sm:p-5 flex items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-3.5 flex-1">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-slate-200/70 rounded w-1/4" />
              <div className="h-3 bg-slate-200/50 rounded w-1/2" />
            </div>
          </div>
          <div className="h-4 bg-slate-200/60 rounded w-20" />
        </div>
      ))}
    </div>
  );
}
