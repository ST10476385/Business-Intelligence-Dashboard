import React from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { motion } from 'framer-motion';

// KPI card renders a single summary metric with trend icon and visual styling.
// This component is reused across dashboard pages for key performance metrics.
export default function KPICard({ title, value, change, changeLabel, icon: Icon, color = "primary", index = 0 }) {
  const isPositive = change > 0;
  const isNeutral = change === 0 || change === undefined;

  const colorMap = {
    primary: {
      card: 'bg-nude-100/80 border-nude-300/60',
      icon: 'bg-nude-300/60 text-nude-700',
      bar: 'bg-nude-400',
    },
    green: {
      card: 'bg-nude-50/90 border-nude-200/80',
      icon: 'bg-nude-200/80 text-nude-600',
      bar: 'bg-nude-500',
    },
    amber: {
      card: 'bg-nude-100/70 border-nude-300/50',
      icon: 'bg-primary/10 text-primary',
      bar: 'bg-primary',
    },
    purple: {
      card: 'bg-nude-50/80 border-nude-200/60',
      icon: 'bg-accent/10 text-accent',
      bar: 'bg-accent',
    },
    red: {
      card: 'bg-nude-50/70 border-nude-200/50',
      icon: 'bg-destructive/10 text-destructive',
      bar: 'bg-destructive',
    },
  };

  const c = colorMap[color] || colorMap.primary;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: 'easeOut' }}
      className={cn(
        "relative overflow-hidden rounded-2xl border p-5 backdrop-blur-sm",
        c.card
      )}
    >
      {/* Decorative circle */}
      <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-primary/5" />

      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground font-medium truncate">
            {title}
          </p>
          <p className="font-display text-3xl font-medium leading-none mt-2">{value}</p>

          {change !== undefined && (
            <div className="flex items-center gap-1.5 pt-1">
              {isNeutral ? (
                <Minus className="w-3 h-3 text-muted-foreground flex-shrink-0" />
              ) : isPositive ? (
                <TrendingUp className="w-3 h-3 text-chart-2 flex-shrink-0" />
              ) : (
                <TrendingDown className="w-3 h-3 text-destructive flex-shrink-0" />
              )}
              <span className={cn(
                "text-xs font-semibold",
                isNeutral ? "text-muted-foreground" : isPositive ? "text-chart-2" : "text-destructive"
              )}>
                {isPositive && '+'}{change}%
              </span>
              {changeLabel && (
                <span className="text-[10px] text-muted-foreground">{changeLabel}</span>
              )}
            </div>
          )}
        </div>

        {Icon && (
          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", c.icon)}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      {/* Bottom accent bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-border/40">
        <div className={cn("h-full w-1/2 rounded-r-full", c.bar)} style={{ opacity: 0.4 }} />
      </div>
    </motion.div>
  );
}