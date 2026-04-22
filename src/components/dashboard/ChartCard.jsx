import React from 'react';
import { cn } from '@/lib/utils';

export default function ChartCard({ title, subtitle, children, className, action }) {
  return (
    <div className={cn(
      "rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm overflow-hidden",
      className
    )}>
      <div className="flex items-start justify-between px-5 pt-5 pb-3 border-b border-border/40">
        <div>
          <h3 className="font-display text-base font-semibold leading-tight">{title}</h3>
          {subtitle && (
            <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground mt-1">{subtitle}</p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}