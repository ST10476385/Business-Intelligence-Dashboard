import React from 'react';
import { cn } from '@/lib/utils';

const ranges = [
  { label: '7D', value: '7d' },
  { label: '30D', value: '30d' },
  { label: '90D', value: '90d' },
  { label: '1Y', value: '1y' },
  { label: 'All', value: 'all' },
];

export default function DateFilter({ value, onChange }) {
  return (
    <div className="flex items-center gap-0.5 bg-nude-100/80 border border-border/50 rounded-xl p-1">
      {ranges.map(range => (
        <button
          key={range.value}
          onClick={() => onChange(range.value)}
          className={cn(
            "h-7 px-3 text-[10px] font-medium tracking-wide rounded-lg transition-all duration-200",
            value === range.value
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-nude-200/50"
          )}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
}