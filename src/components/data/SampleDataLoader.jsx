import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { khanyisaApi } from '@/api/khanyisaClient';
import { Database, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { generateSalesSample, generateUserAnalyticsSample } from '@/lib/sampleData';

// SampleDataLoader generates demo datasets and saves them into the backend.
// It batches records to avoid sending too much data in one request.
export default function SampleDataLoader() {
  const [loading, setLoading] = useState(null);
  const [done, setDone] = useState({});
  const queryClient = useQueryClient();

  const loadSampleData = async (type) => {
    setLoading(type);
    const data = type === 'sales' ? generateSalesSample(90) : generateUserAnalyticsSample(90);
    const entity = type === 'sales' ? 'SalesData' : 'UserAnalytics';

    // Batch in chunks of 50
    for (let i = 0; i < data.length; i += 50) {
      const chunk = data.slice(i, i + 50);
      await khanyisaApi.entities[entity].bulkCreate(chunk);
    }

    queryClient.invalidateQueries({ queryKey: [type === 'sales' ? 'sales' : 'analytics'] });
    setLoading(null);
    setDone(prev => ({ ...prev, [type]: true }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Load Sample Data</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Generate realistic sample data to explore the dashboard features.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={() => loadSampleData('sales')}
            disabled={loading !== null}
            variant="outline"
            className="gap-2"
          >
            {loading === 'sales' ? <Loader2 className="w-4 h-4 animate-spin" /> :
             done.sales ? <CheckCircle2 className="w-4 h-4 text-chart-2" /> :
             <Database className="w-4 h-4" />}
            {done.sales ? 'Sales Data Loaded' : 'Load Sales Data (90 days)'}
          </Button>
          <Button
            onClick={() => loadSampleData('analytics')}
            disabled={loading !== null}
            variant="outline"
            className="gap-2"
          >
            {loading === 'analytics' ? <Loader2 className="w-4 h-4 animate-spin" /> :
             done.analytics ? <CheckCircle2 className="w-4 h-4 text-chart-2" /> :
             <Database className="w-4 h-4" />}
            {done.analytics ? 'Analytics Data Loaded' : 'Load User Analytics (90 days)'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}