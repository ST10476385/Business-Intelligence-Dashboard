import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { format, addDays, subDays } from 'date-fns';

export default function ForecastChart({ data }) {
  const chartData = useMemo(() => {
    // Aggregate actual data
    const grouped = {};
    data.forEach(d => {
      grouped[d.date] = (grouped[d.date] || 0) + (d.revenue || 0);
    });
    const actual = Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-30)
      .map(([date, value]) => ({ date, actual: Math.round(value), forecast: null }));

    // Simple forecast: average of last 7 days with slight growth
    const last7 = actual.slice(-7);
    const avg = last7.reduce((s, d) => s + d.actual, 0) / 7;
    const lastDate = actual[actual.length - 1]?.date || format(new Date(), 'yyyy-MM-dd');
    
    const forecast = [];
    for (let i = 1; i <= 14; i++) {
      const growth = 1 + (Math.random() * 0.1 - 0.03);
      forecast.push({
        date: format(addDays(new Date(lastDate), i), 'yyyy-MM-dd'),
        actual: null,
        forecast: Math.round(avg * growth),
      });
    }

    return [...actual, ...forecast];
  }, [data]);

  const todayStr = format(new Date(), 'yyyy-MM-dd');

  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(18, 35%, 55%)" stopOpacity={0.35} />
              <stop offset="100%" stopColor="hsl(18, 35%, 55%)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(345, 25%, 68%)" stopOpacity={0.3} />
              <stop offset="100%" stopColor="hsl(345, 25%, 68%)" stopOpacity={0} />
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
            formatter={(value, name) => [value ? `R${value.toLocaleString()}` : '—', name]}
            labelFormatter={v => format(new Date(v), 'MMM d, yyyy')}
          />
          <ReferenceLine
            x={todayStr}
            stroke="hsl(var(--muted-foreground))"
            strokeDasharray="5 5"
            label={{ value: 'Today', fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
          />
          <Area
            type="monotone"
            dataKey="actual"
            stroke="hsl(18, 35%, 55%)"
            fill="url(#actualGrad)"
            strokeWidth={2}
            connectNulls={false}
            name="Actual"
          />
          <Area
            type="monotone"
            dataKey="forecast"
            stroke="hsl(345, 25%, 68%)"
            fill="url(#forecastGrad)"
            strokeWidth={2}
            strokeDasharray="5 5"
            connectNulls={false}
            name="Forecast"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}