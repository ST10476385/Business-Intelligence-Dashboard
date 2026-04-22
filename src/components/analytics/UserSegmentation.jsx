import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { aggregateByField } from '@/lib/sampleData';

const COLORS = [
  'hsl(18, 35%, 55%)',
  'hsl(32, 38%, 58%)',
  'hsl(345, 25%, 68%)',
  'hsl(26, 22%, 48%)',
  'hsl(355, 30%, 72%)',
];

export default function UserSegmentation({ data }) {
  const segments = useMemo(() => aggregateByField(data, 'segment', 'sessions'), [data]);
  const total = segments.reduce((s, d) => s + d.value, 0);

  return (
    <div className="h-[280px] w-full flex flex-col">
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={segments}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
              nameKey="name"
            >
              {segments.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              formatter={(value) => [value.toLocaleString(), 'Sessions']}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap justify-center gap-3 mt-2">
        {segments.map((seg, i) => (
          <div key={seg.name} className="flex items-center gap-1.5 text-xs">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
            <span className="capitalize text-muted-foreground">{seg.name}</span>
            <span className="font-semibold">{total > 0 ? ((seg.value / total) * 100).toFixed(0) : 0}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}