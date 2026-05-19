import React from "react"

export const TableSkeleton: React.FC = () => {
  return (
    <div className="w-full space-y-4 animate-pulse">
      <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
        <div className="bg-slate-50 dark:bg-slate-800/40 h-12 border-b border-slate-200 dark:border-slate-800"></div>
        <div className="divide-y divide-slate-200 dark:divide-slate-800">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-4 flex items-center justify-between gap-4 h-16">
              <div className="w-1/4 space-y-2">
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
              </div>
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/4 hidden sm:block"></div>
              <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-full w-20"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/6 hidden md:block"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/6 hidden lg:block"></div>
              <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
