import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { aggregateByDate } from '@/lib/sampleData';
import { format } from 'date-fns';

export default function RevenueChart({ data }) {
  const chartData = useMemo(() => {
    const revenueByDate = {};
    const profitByDate = {};
    data.forEach(d => {
      revenueByDate[d.date] = (revenueByDate[d.date] || 0) + (d.revenue || 0);
      profitByDate[d.date] = (profitByDate[d.date] || 0) + (d.profit || 0);
    });
    return Object.keys(revenueByDate).sort().map(date => ({
      date,
      revenue: Math.round(revenueByDate[date]),
      profit: Math.round(profitByDate[date]),
    }));
  }, [data]);

  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(18, 35%, 55%)" stopOpacity={0.35} />
              <stop offset="100%" stopColor="hsl(18, 35%, 55%)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(32, 38%, 58%)" stopOpacity={0.3} />
              <stop offset="100%" stopColor="hsl(32, 38%, 58%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="date"
            tickFormatter={v => format(new Date(v), 'MMM d')}
            tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={v => `R${(v / 1000).toFixed(0)}K`}
            tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              fontSize: '12px',
            }}
            formatter={(value) => [`R${value.toLocaleString()}`, '']}
            labelFormatter={v => format(new Date(v), 'MMM d, yyyy')}
          />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="hsl(18, 35%, 55%)"
            fill="url(#revGrad)"
            strokeWidth={2}
            name="Revenue"
          />
          <Area
            type="monotone"
            dataKey="profit"
            stroke="hsl(32, 38%, 58%)"
            fill="url(#profitGrad)"
            strokeWidth={2}
            name="Profit"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}