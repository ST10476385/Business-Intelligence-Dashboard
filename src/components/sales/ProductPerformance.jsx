import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { aggregateByField } from '@/lib/sampleData';

const COLORS = [
  'hsl(18, 35%, 55%)',
  'hsl(32, 38%, 58%)',
  'hsl(345, 25%, 68%)',
  'hsl(26, 22%, 48%)',
  'hsl(355, 30%, 72%)',
];

export default function ProductPerformance({ data }) {
  const chartData = useMemo(() => aggregateByField(data, 'product', 'revenue').slice(0, 5), [data]);

  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
          <XAxis
            type="number"
            tickFormatter={v => `R${(v / 1000).toFixed(0)}K`}
            tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            dataKey="name"
            type="category"
            tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
            axisLine={false}
            tickLine={false}
            width={120}
          />
          <Tooltip
            contentStyle={{
              background: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              fontSize: '12px',
            }}
            formatter={(value) => [`R${value.toLocaleString()}`, 'Revenue']}
          />
          <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={24}>
            {chartData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}