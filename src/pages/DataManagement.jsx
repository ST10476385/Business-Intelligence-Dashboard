// DataManagement page — allows users to import their own data or load sample data
// Three tabs: Import (CSV/Excel upload), Sample Data (seed database), Data Preview (view records)
import React from 'react';
import { Upload, FileSpreadsheet, Database } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageHeader from '@/components/dashboard/PageHeader';
import FileUploader from '@/components/data/FileUploader';
import DataPreview from '@/components/data/DataPreview';
import SampleDataLoader from '@/components/data/SampleDataLoader';

export default function DataManagement() {
  return (
    <div>
      {/* Page title — no filters needed on this page */}
      <PageHeader
        title="Data Management"
        subtitle="Import, manage, and configure your data sources"
      />

      {/* Tabbed interface: Import | Sample Data | Preview */}
      <Tabs defaultValue="import" className="space-y-4">
        <TabsList>
          {/* Upload a CSV, Excel, or JSON file to populate SalesData or UserAnalytics */}
          <TabsTrigger value="import" className="gap-2">
            <Upload className="w-4 h-4" /> Import Data
          </TabsTrigger>
          {/* Generate and insert 90 days of realistic sample data into the database */}
          <TabsTrigger value="sample" className="gap-2">
            <Database className="w-4 h-4" /> Sample Data
          </TabsTrigger>
          {/* Read-only table view of the most recent records in both entities */}
          <TabsTrigger value="preview" className="gap-2">
            <FileSpreadsheet className="w-4 h-4" /> Data Preview
          </TabsTrigger>
        </TabsList>

        {/* Tab: CSV / Excel file import with AI-powered field extraction */}
        <TabsContent value="import">
          <FileUploader />
        </TabsContent>

        {/* Tab: One-click sample data loader for SalesData and UserAnalytics */}
        <TabsContent value="sample">
          <SampleDataLoader />
        </TabsContent>

        {/* Tab: Paginated preview of current database records */}
        <TabsContent value="preview">
          <DataPreview />
        </TabsContent>
      </Tabs>
    </div>
  );
}