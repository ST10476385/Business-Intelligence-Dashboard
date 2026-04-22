import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const typeStyles = {
  success: {
    card: 'bg-nude-100/70 border-nude-300/50',
    icon: 'bg-nude-300/60 text-nude-700',
  },
  warning: {
    card: 'bg-nude-50/80 border-nude-200/60',
    icon: 'bg-primary/10 text-primary',
  },
  info: {
    card: 'bg-nude-100/60 border-nude-200/70',
    icon: 'bg-accent/15 text-accent',
  },
};

export default function InsightCard({ type, icon: Icon, title, description, index = 0 }) {
  const s = typeStyles[type] || typeStyles.info;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: 'easeOut' }}
      className={cn("rounded-2xl border p-5 backdrop-blur-sm", s.card)}
    >
      <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center mb-3", s.icon)}>
        <Icon className="w-4 h-4" />
      </div>
      <h3 className="font-display text-base font-semibold mb-1.5 leading-tight">{title}</h3>
      <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
    </motion.div>
  );
}