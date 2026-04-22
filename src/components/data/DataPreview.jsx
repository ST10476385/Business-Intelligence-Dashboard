import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { khanyisaApi } from '@/api/khanyisaClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

// DataPreview displays recent SalesData and UserAnalytics records in a tabbed table.
// It uses skeleton loaders while data is loading and shows fallback content when empty.
export default function DataPreview() {
  const { data: salesData = [], isLoading: salesLoading } = useQuery({
    queryKey: ['sales-preview'],
    queryFn: () => khanyisaApi.entities.SalesData.list('-date', 20),
  });

  const { data: analyticsData = [], isLoading: analyticsLoading } = useQuery({
    queryKey: ['analytics-preview'],
    queryFn: () => khanyisaApi.entities.UserAnalytics.list('-date', 20),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center justify-between">
          Data Preview
          <div className="flex gap-2">
            <Badge variant="secondary">{salesData.length} sales records</Badge>
            <Badge variant="secondary">{analyticsData.length} analytics records</Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="sales">
          <TabsList className="mb-3">
            <TabsTrigger value="sales">Sales Data</TabsTrigger>
            <TabsTrigger value="analytics">User Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="sales">
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="text-xs">Date</TableHead>
                    <TableHead className="text-xs">Product</TableHead>
                    <TableHead className="text-xs">Region</TableHead>
                    <TableHead className="text-xs text-right">Revenue</TableHead>
                    <TableHead className="text-xs text-right">Profit</TableHead>
                    <TableHead className="text-xs text-right">Units</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {salesLoading ? (
                    Array(5).fill(0).map((_, i) => (
                      <TableRow key={i}>
                        {Array(6).fill(0).map((_, j) => (
                          <TableCell key={j}><Skeleton className="h-4 w-16" /></TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : salesData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        No sales data yet. Import or load sample data.
                      </TableCell>
                    </TableRow>
                  ) : (
                    salesData.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell className="text-xs">{row.date ? format(new Date(row.date), 'MMM d, yyyy') : '—'}</TableCell>
                        <TableCell className="text-xs font-medium">{row.product}</TableCell>
                        <TableCell className="text-xs">{row.region}</TableCell>
                        <TableCell className="text-xs text-right font-mono">${(row.revenue || 0).toLocaleString()}</TableCell>
                        <TableCell className="text-xs text-right font-mono">${(row.profit || 0).toLocaleString()}</TableCell>
                        <TableCell className="text-xs text-right font-mono">{row.units_sold || 0}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="text-xs">Date</TableHead>
                    <TableHead className="text-xs">Page</TableHead>
                    <TableHead className="text-xs">Segment</TableHead>
                    <TableHead className="text-xs text-right">Sessions</TableHead>
                    <TableHead className="text-xs text-right">Bounce %</TableHead>
                    <TableHead className="text-xs text-right">CTR %</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analyticsLoading ? (
                    Array(5).fill(0).map((_, i) => (
                      <TableRow key={i}>
                        {Array(6).fill(0).map((_, j) => (
                          <TableCell key={j}><Skeleton className="h-4 w-16" /></TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : analyticsData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        No analytics data yet. Import or load sample data.
                      </TableCell>
                    </TableRow>
                  ) : (
                    analyticsData.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell className="text-xs">{row.date ? format(new Date(row.date), 'MMM d, yyyy') : '—'}</TableCell>
                        <TableCell className="text-xs font-medium">{row.page}</TableCell>
                        <TableCell className="text-xs capitalize">{row.segment}</TableCell>
                        <TableCell className="text-xs text-right font-mono">{(row.sessions || 0).toLocaleString()}</TableCell>
                        <TableCell className="text-xs text-right font-mono">{(row.bounce_rate || 0).toFixed(1)}%</TableCell>
                        <TableCell className="text-xs text-right font-mono">{(row.click_through_rate || 0).toFixed(1)}%</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}