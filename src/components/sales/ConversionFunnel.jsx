import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

export default function ConversionFunnel({ data }) {
  const funnel = useMemo(() => {
    const totalLeads = data.reduce((s, d) => s + (d.leads || 0), 0);
    const totalConversions = data.reduce((s, d) => s + (d.conversions || 0), 0);
    const qualified = Math.round(totalLeads * 0.6);
    const proposals = Math.round(qualified * 0.5);

    return [
      { label: 'Leads', value: totalLeads, color: 'hsl(18, 35%, 55%)' },
      { label: 'Qualified', value: qualified, color: 'hsl(32, 38%, 58%)' },
      { label: 'Proposals', value: proposals, color: 'hsl(345, 25%, 68%)' },
      { label: 'Conversions', value: totalConversions, color: 'hsl(26, 22%, 48%)' },
    ];
  }, [data]);

  const maxVal = funnel[0]?.value || 1;

  return (
    <div className="space-y-3 pt-4">
      {funnel.map((stage, i) => {
        const widthPct = Math.max((stage.value / maxVal) * 100, 20);
        return (
          <motion.div
            key={stage.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-3"
          >
            <span className="text-xs text-muted-foreground w-20 text-right">{stage.label}</span>
            <div className="flex-1 relative">
              <div
                className="h-8 rounded-md flex items-center px-3 transition-all"
                style={{ width: `${widthPct}%`, backgroundColor: stage.color }}
              >
                <span className="text-xs font-semibold text-white">
                  {stage.value.toLocaleString()}
                </span>
              </div>
            </div>
          </motion.div>
        );
      })}
      <div className="pt-2 text-center">
        <span className="text-xs text-muted-foreground">
          Overall Rate: <span className="font-semibold text-foreground">
            {maxVal > 0 ? ((funnel[3]?.value / maxVal) * 100).toFixed(1) : 0}%
          </span>
        </span>
      </div>
    </div>
  );
}