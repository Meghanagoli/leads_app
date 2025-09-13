'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';

interface CsvImportProps {
  onImport: (csvData: string) => Promise<{
    success: boolean;
    imported: number;
    errors: Array<{ row: number; message: string }>;
  }>;
}

export function CsvImport({ onImport }: CsvImportProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    imported: number;
    errors: Array<{ row: number; message: string }>;
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      setResult(null);
    } else {
      alert('Please select a valid CSV file');
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setIsImporting(true);
    try {
      const csvData = await file.text();
      const importResult = await onImport(csvData);
      setResult(importResult);
    } catch (error) {
      setResult({
        success: false,
        imported: 0,
        errors: [{ row: 0, message: 'Failed to import CSV file' }]
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="group bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 border-indigo-200 hover:border-indigo-300 text-indigo-700 hover:text-indigo-800 shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3 rounded-2xl font-bold flex items-center space-x-3 hover:scale-105 transform">
          <Upload className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
          <span>Import CSV</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl bg-white/95 backdrop-blur-xl border border-white/20 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Import Buyer Leads from CSV
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="csv-file">Select CSV File</Label>
            <div className="mt-1 flex items-center space-x-4">
              <Input
                id="csv-file"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="flex-1"
              />
              <Button
                onClick={handleImport}
                disabled={!file || isImporting}
                className="flex items-center space-x-2"
              >
                <Upload className="h-4 w-4" />
                <span>{isImporting ? 'Importing...' : 'Import'}</span>
              </Button>
            </div>
          </div>

      {file && (
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <FileText className="h-4 w-4" />
          <span>Selected: {file.name}</span>
        </div>
      )}

      {result && (
        <div className={`p-4 rounded-md ${
          result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex items-center space-x-2">
            {result.success ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600" />
            )}
            <div>
              <p className={`font-medium ${
                result.success ? 'text-green-800' : 'text-red-800'
              }`}>
                {result.success 
                  ? `Successfully imported ${result.imported} leads`
                  : 'Import failed'
                }
              </p>
              {result.errors.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium text-red-800">Errors:</p>
                  <ul className="mt-1 text-sm text-red-700 list-disc list-inside">
                    {result.errors.slice(0, 5).map((error, index) => (
                      <li key={index}>
                        Row {error.row}: {error.message}
                      </li>
                    ))}
                    {result.errors.length > 5 && (
                      <li>... and {result.errors.length - 5} more errors</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

          <div className="text-sm text-gray-500">
            <p><strong>CSV Format:</strong></p>
            <p>Expected headers: fullName, email, phone, city, propertyType, bhk, purpose, budgetMin, budgetMax, timeline, source, notes, tags, status</p>
            <p>Maximum 200 rows allowed per import.</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
