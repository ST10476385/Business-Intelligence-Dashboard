// InsightsPage — automated business insights and AI-generated analysis
// Combines sales and analytics data to surface trends, risks, and opportunities
import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { khanyisaApi } from '@/api/khanyisaClient';
import { Sparkles, TrendingUp, AlertTriangle, Lightbulb, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PageHeader from '@/components/dashboard/PageHeader';
import ChartCard from '@/components/dashboard/ChartCard';
import InsightCard from '@/components/insights/InsightCard';
import ForecastChart from '@/components/insights/ForecastChart';
import TrendAnalysis from '@/components/insights/TrendAnalysis';
import { generateSalesSample, generateUserAnalyticsSample } from '@/lib/sampleData';

export default function InsightsPage() {
  // Stores AI-generated insight response from the LLM integration
  const [aiInsights, setAiInsights] = useState(null);
  // Loading state while waiting for LLM response
  const [loadingAI, setLoadingAI] = useState(false);

  // Fetch sales records — used to compute revenue insights
  const { data: salesData = [] } = useQuery({
    queryKey: ['sales'],
    queryFn: () => khanyisaApi.entities.SalesData.list('-date', 500),
    initialData: [],
  });

  // Fetch analytics records — used to compute engagement insights
  const { data: analyticsData = [] } = useQuery({
    queryKey: ['analytics'],
    queryFn: () => khanyisaApi.entities.UserAnalytics.list('-date', 500),
    initialData: [],
  });

  // Use real data if available, otherwise fall back to generated sample data
  const sales = salesData.length > 0 ? salesData : generateSalesSample(180);
  const analytics = analyticsData.length > 0 ? analyticsData : generateUserAnalyticsSample(180);

  // Compute rule-based static insights from the data (no AI required)
  const insights = useMemo(() => {
    // Sum total revenue across all sales records
    const totalRevenue = sales.reduce((s, d) => s + (d?.revenue || 0), 0);

    // Group revenue by product to identify the top-performing product
    const topProduct = sales.reduce((acc, d) => {
      const product = d?.product || 'Unknown';
      acc[product] = (acc[product] || 0) + (d?.revenue || 0);
      return acc;
    }, {});
    const bestProduct = Object.entries(topProduct).sort(([, a], [, b]) => b - a)[0];

    // Group revenue by region to identify the weakest-performing region
    const regionPerf = sales.reduce((acc, d) => {
      const region = d?.region || 'Unknown';
      acc[region] = (acc[region] || 0) + (d?.revenue || 0);
      return acc;
    }, {});
    const weakestRegion = Object.entries(regionPerf).sort(([, a], [, b]) => a - b)[0];

    // Average bounce rate across all analytics records
    const avgBounce = analytics.reduce((s, d) => s + (d?.bounce_rate || 0), 0) / (analytics.length || 1);

    // Return the three insight cards with ZAR formatting for monetary values
    return [
      {
        type: 'success',
        icon: TrendingUp,
        title: 'Revenue Growth Detected',
        // Display total revenue in ZAR thousands (R X K)
        description: `Total revenue of R${(totalRevenue / 1000).toFixed(0)}K shows strong performance. ${bestProduct ? `${bestProduct[0]} is your top earner at R${(bestProduct[1] / 1000).toFixed(0)}K.` : ''}`,
      },
      {
        type: 'warning',
        icon: AlertTriangle,
        title: 'Underperforming Region',
        // Highlight the region with the lowest revenue in ZAR
        description: weakestRegion ? `${weakestRegion[0]} has the lowest sales at R${(weakestRegion[1] / 1000).toFixed(0)}K. Consider targeted campaigns to boost performance.` : 'All regions performing similarly.',
      },
      {
        type: 'info',
        icon: Lightbulb,
        title: 'User Engagement Opportunity',
        description: `Average bounce rate is ${avgBounce.toFixed(1)}%. ${avgBounce > 40 ? 'Consider improving landing page content to reduce bounce rates.' : 'Bounce rates are healthy.'}`,
      },
    ];
  }, [sales, analytics]);

  // Calls the LLM integration to generate AI-powered insights based on a data summary
  const generateAIInsights = async () => {
    setLoadingAI(true);

    // Summarise the most recent 30 records for the prompt (keeps token count low)
    const recentSales = sales.slice(0, 30);
    const summary = {
      total_revenue: recentSales.reduce((s, d) => s + (d?.revenue || 0), 0),
      total_profit: recentSales.reduce((s, d) => s + (d?.profit || 0), 0),
      total_units: recentSales.reduce((s, d) => s + (d?.units_sold || 0), 0),
      avg_bounce: analytics.slice(0, 30).reduce((s, d) => s + (d?.bounce_rate || 0), 0) / 30,
      total_sessions: analytics.slice(0, 30).reduce((s, d) => s + (d?.sessions || 0), 0),
    };

    // Send data summary to the LLM and request a structured JSON response
    const result = await khanyisaApi.integrations.Core.InvokeLLM({
      prompt: `You are a business intelligence analyst. Analyze this data summary and provide actionable insights:
      
      Sales Data (last 30 records, currency: South African Rand ZAR):
      - Total Revenue: R${summary.total_revenue.toFixed(2)}
      - Total Profit: R${summary.total_profit.toFixed(2)}
      - Total Units Sold: ${summary.total_units}
      
      User Analytics (last 30 records):
      - Average Bounce Rate: ${summary.avg_bounce.toFixed(1)}%
      - Total Sessions: ${summary.total_sessions}
      
      Provide 3-4 specific, actionable insights with predicted trends. Use ZAR (R) for all monetary values.`,
      response_json_schema: {
        type: 'object',
        properties: {
          insights: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                description: { type: 'string' },
                prediction: { type: 'string' },
                confidence: { type: 'string' },
              },
            },
          },
          overall_summary: { type: 'string' },
        },
      },
    });

    setAiInsights(result);
    setLoadingAI(false);
  };

  return (
    <div>
      {/* Page header with AI insights trigger button */}
      <PageHeader
        title="Insights & Trends"
        subtitle="AI-powered analysis and forecasting"
      >
        <Button
          onClick={generateAIInsights}
          disabled={loadingAI}
          className="gap-2"
        >
          {loadingAI ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          Generate AI Insights
        </Button>
      </PageHeader>

      {/* Rule-based static insight cards (always visible) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {insights.map((insight, i) => (
          <InsightCard key={i} {...insight} index={i} />
        ))}
      </div>

      {/* AI-generated insights section — only rendered after user clicks the button */}
      {aiInsights && (
        <div className="mb-6">
          <ChartCard title="AI-Powered Analysis" subtitle="Generated insights based on your data" className="" action={null}>
            <div className="space-y-4">
              {/* High-level summary paragraph from the LLM */}
              {aiInsights.overall_summary && (
                <p className="text-sm text-muted-foreground bg-secondary/50 p-4 rounded-lg">
                  {aiInsights.overall_summary}
                </p>
              )}
              {/* Individual insight cards returned by the LLM */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {aiInsights.insights?.map((insight, i) => (
                  <div key={i} className="p-4 rounded-lg border bg-card">
                    <h4 className="text-sm font-semibold mb-1">{insight.title}</h4>
                    <p className="text-xs text-muted-foreground mb-2">{insight.description}</p>
                    {insight.prediction && (
                      <p className="text-xs text-primary font-medium">
                        Prediction: {insight.prediction}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </ChartCard>
        </div>
      )}

      {/* Revenue forecast chart + correlated trend analysis side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Revenue Forecast" subtitle="Projected revenue based on trends" className="" action={null}>
          <ForecastChart data={sales} />
        </ChartCard>
        <ChartCard title="Trend Analysis" subtitle="Key metrics over time" className="" action={null}>
          <TrendAnalysis salesData={sales} analyticsData={analytics} />
        </ChartCard>
      </div>
    </div>
  );
}