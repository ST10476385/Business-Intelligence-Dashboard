import React, { useState, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { khanyisaApi } from '@/api/khanyisaClient';
import { Upload, FileText, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

// FileUploader handles file selection, upload, field extraction, and database insertion.
// It supports CSV, Excel, and JSON files for both SalesData and UserAnalytics.
export default function FileUploader() {
  const [entityType, setEntityType] = useState('SalesData');
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState(null);
  const fileRef = useRef(null);
  const queryClient = useQueryClient();

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setStatus(null);

    const { file_url } = await khanyisaApi.integrations.Core.UploadFile({ file });

    const schema = await khanyisaApi.entities[entityType].schema();

    const result = await khanyisaApi.integrations.Core.ExtractDataFromUploadedFile({
      file_url,
      json_schema: {
        type: 'array',
        items: { type: 'object', properties: schema.properties },
      },
    });

    if (result.status === 'success' && result.output) {
      const records = Array.isArray(result.output) ? result.output : [result.output];
      await khanyisaApi.entities[entityType].bulkCreate(records);
      queryClient.invalidateQueries({ queryKey: [entityType === 'SalesData' ? 'sales' : 'analytics'] });
      setStatus({ type: 'success', message: `Successfully imported ${records.length} records.` });
    } else {
      setStatus({ type: 'error', message: result.details || 'Failed to extract data from file.' });
    }

    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Import from CSV / Excel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Target Dataset</Label>
          <Select value={entityType} onValueChange={setEntityType}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SalesData">Sales Data</SelectItem>
              <SelectItem value="UserAnalytics">User Analytics</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div
          className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
          onClick={() => fileRef.current?.click()}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground">Processing file...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="w-8 h-8 text-muted-foreground" />
              <p className="text-sm font-medium">Click to upload CSV or Excel file</p>
              <p className="text-xs text-muted-foreground">Supports .csv, .xlsx, .json files</p>
            </div>
          )}
          <input
            ref={fileRef}
            type="file"
            accept=".csv,.xlsx,.xls,.json"
            className="hidden"
            onChange={handleUpload}
          />
        </div>

        {status && (
          <div className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
            status.type === 'success' ? 'bg-chart-2/10 text-chart-2' : 'bg-destructive/10 text-destructive'
          }`}>
            {status.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {status.message}
          </div>
        )}
      </CardContent>
    </Card>
  );
}