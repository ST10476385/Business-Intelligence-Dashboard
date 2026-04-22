import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

export default function SessionsChart({ data }) {
  const chartData = useMemo(() => {
    const grouped = {};
    data.forEach(d => {
      if (!grouped[d.date]) grouped[d.date] = { sessions: 0, visitors: 0 };
      grouped[d.date].sessions += d.sessions || 0;
      grouped[d.date].visitors += d.unique_visitors || 0;
    });
    return Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b)).map(([date, v]) => ({
      date,
      sessions: v.sessions,
      visitors: v.visitors,
    }));
  }, [data]);

  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            dataKey="date"
            tickFormatter={v => format(new Date(v), 'MMM d')}
            tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
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
            labelFormatter={v => format(new Date(v), 'MMM d, yyyy')}
          />
          <Line
            type="monotone"
            dataKey="sessions"
            stroke="hsl(18, 35%, 55%)"
            strokeWidth={2}
            dot={false}
            name="Sessions"
          />
          <Line
            type="monotone"
            dataKey="visitors"
            stroke="hsl(345, 25%, 68%)"
            strokeWidth={2}
            dot={false}
            name="Unique Visitors"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}