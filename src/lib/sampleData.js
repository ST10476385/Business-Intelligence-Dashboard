// Generate sample data for demo/placeholder purposes.
// This module provides sales and user analytics data used when no live backend data is available.
import { format, subDays } from 'date-fns';

const products = ['Enterprise Suite', 'Cloud Platform', 'Analytics Pro', 'Security Shield', 'Data Warehouse'];
const categories = ['Software', 'Services', 'Hardware', 'Support', 'Consulting'];
const regions = ['North America', 'Europe', 'Asia Pacific', 'Latin America', 'Middle East'];
const pages = ['Homepage', 'Pricing', 'Features', 'Dashboard', 'Documentation', 'Blog', 'Contact', 'Signup'];
const segments = ['organic', 'paid', 'social', 'referral', 'direct'];

export function generateSalesSample(days = 90) {
  const data = [];
  for (let i = days; i >= 0; i--) {
    const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
    const baseRevenue = 5000 + Math.random() * 15000;
    const cost = baseRevenue * (0.3 + Math.random() * 0.3);
    data.push({
      date,
      product: products[Math.floor(Math.random() * products.length)],
      category: categories[Math.floor(Math.random() * categories.length)],
      region: regions[Math.floor(Math.random() * regions.length)],
      revenue: Math.round(baseRevenue * 100) / 100,
      cost: Math.round(cost * 100) / 100,
      profit: Math.round((baseRevenue - cost) * 100) / 100,
      units_sold: Math.floor(10 + Math.random() * 200),
      leads: Math.floor(20 + Math.random() * 100),
      conversions: Math.floor(5 + Math.random() * 40),
    });
  }
  return data;
}

export function generateUserAnalyticsSample(days = 90) {
  const data = [];
  for (let i = days; i >= 0; i--) {
    const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
    const sessions = Math.floor(500 + Math.random() * 3000);
    const unique = Math.floor(sessions * (0.5 + Math.random() * 0.3));
    data.push({
      date,
      page: pages[Math.floor(Math.random() * pages.length)],
      sessions,
      page_views: Math.floor(sessions * (1.2 + Math.random() * 2)),
      unique_visitors: unique,
      bounce_rate: Math.round((20 + Math.random() * 50) * 100) / 100,
      avg_session_duration: Math.floor(30 + Math.random() * 300),
      click_through_rate: Math.round((1 + Math.random() * 8) * 100) / 100,
      new_users: Math.floor(unique * (0.2 + Math.random() * 0.4)),
      returning_users: Math.floor(unique * (0.3 + Math.random() * 0.3)),
      segment: segments[Math.floor(Math.random() * segments.length)],
    });
  }
  return data;
}

export function aggregateByDate(data, valueKey) {
  const grouped = {};
  data.forEach(item => {
    if (!grouped[item.date]) grouped[item.date] = 0;
    grouped[item.date] += item[valueKey] || 0;
  });
  return Object.entries(grouped)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, value]) => ({ date, value: Math.round(value * 100) / 100 }));
}

export function aggregateByField(data, field, valueKey) {
  const grouped = {};
  data.forEach(item => {
    const key = item[field] || 'Unknown';
    if (!grouped[key]) grouped[key] = 0;
    grouped[key] += item[valueKey] || 0;
  });
  return Object.entries(grouped)
    .sort(([, a], [, b]) => b - a)
    .map(([name, value]) => ({ name, value: Math.round(value * 100) / 100 }));
}

export function filterByDateRange(data, range) {
  const now = new Date();
  let daysBack;
  switch (range) {
    case '7d': daysBack = 7; break;
    case '30d': daysBack = 30; break;
    case '90d': daysBack = 90; break;
    case '1y': daysBack = 365; break;
    default: return data;
  }
  const cutoff = format(subDays(now, daysBack), 'yyyy-MM-dd');
  return data.filter(item => item.date >= cutoff);
}

// Formats a number as South African Rand (ZAR) currency
// Uses shorthand: R1.2M for millions, R500K for thousands
export function formatCurrency(value) {
  if (value >= 1000000) return `R${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `R${(value / 1000).toFixed(1)}K`;
  return `R${value.toFixed(0)}`;
}

export function formatNumber(value) {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return value.toFixed(0);
}