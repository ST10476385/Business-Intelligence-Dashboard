import React from 'react';

// PageHeader is a reusable section header used by dashboard pages.
// It renders the title, subtitle, and optional action controls.
export default function PageHeader({ title, subtitle, children }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-7">
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight leading-tight">{title}</h1>
        {subtitle && (
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mt-1.5">{subtitle}</p>
        )}
      </div>
      {children && (
        <div className="flex items-center gap-2.5 flex-wrap">{children}</div>
      )}
    </div>
  );
}