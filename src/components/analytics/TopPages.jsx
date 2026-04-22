import React, { useMemo } from 'react';
import { aggregateByField } from '@/lib/sampleData';
import { cn } from '@/lib/utils';

const COLORS = [
  'bg-chart-1',
  'bg-chart-2',
  'bg-chart-3',
  'bg-chart-4',
  'bg-chart-5',
];

export default function TopPages({ data }) {
  const pages = useMemo(() => aggregateByField(data, 'page', 'page_views').slice(0, 6), [data]);
  const maxVal = pages[0]?.value || 1;

  return (
    <div className="space-y-3 pt-2">
      {pages.map((page, i) => (
        <div key={page.name} className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium">{page.name}</span>
            <span className="text-muted-foreground font-mono">{page.value.toLocaleString()}</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all", COLORS[i % COLORS.length])}
              style={{ width: `${(page.value / maxVal) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}