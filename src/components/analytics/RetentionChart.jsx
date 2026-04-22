import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format } from 'date-fns';

export default function RetentionChart({ data }) {
  const chartData = useMemo(() => {
    const grouped = {};
    data.forEach(d => {
      if (!grouped[d.date]) grouped[d.date] = { new_users: 0, returning: 0 };
      grouped[d.date].new_users += d.new_users || 0;
      grouped[d.date].returning += d.returning_users || 0;
    });
    return Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b)).map(([date, v]) => ({
      date,
      'New Users': v.new_users,
      'Returning': v.returning,
    }));
  }, [data]);

  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
          <Legend wrapperStyle={{ fontSize: '11px' }} />
          <Bar dataKey="New Users" fill="hsl(18, 35%, 55%)" radius={[4, 4, 0, 0]} barSize={12} />
          <Bar dataKey="Returning" fill="hsl(32, 38%, 58%)" radius={[4, 4, 0, 0]} barSize={12} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}