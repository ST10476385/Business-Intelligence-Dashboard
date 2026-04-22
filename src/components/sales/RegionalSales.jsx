import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { aggregateByField } from '@/lib/sampleData';

const COLORS = [
  'hsl(18, 35%, 55%)',
  'hsl(32, 38%, 58%)',
  'hsl(345, 25%, 68%)',
  'hsl(26, 22%, 48%)',
  'hsl(355, 30%, 72%)',
];

export default function RegionalSales({ data }) {
  const chartData = useMemo(() => aggregateByField(data, 'region', 'revenue'), [data]);

  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={3}
            dataKey="value"
            nameKey="name"
          >
            {chartData.map((_, i) => (
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
            formatter={(value) => [`R${value.toLocaleString()}`, 'Revenue']}
          />
          <Legend
            wrapperStyle={{ fontSize: '11px' }}
            formatter={(value) => <span style={{ color: 'hsl(var(--foreground))' }}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}