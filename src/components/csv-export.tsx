'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface CsvExportProps {
  onExport: () => Promise<string>;
  currentFilters: {
    search: string;
    city: string;
    propertyType: string;
    status: string;
    timeline: string;
  };
}

export function CsvExport({ onExport, currentFilters }: CsvExportProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const csvData = await onExport();
      
      // Create and download the file
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `buyer-leads-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export CSV file');
    } finally {
      setIsExporting(false);
    }
  };

  const hasActiveFilters = Object.values(currentFilters).some(value => value);

  return (
    <div className="space-y-3">
      <Button
        onClick={handleExport}
        disabled={isExporting}
        variant="outline"
        className="group bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 border-emerald-200 hover:border-emerald-300 text-emerald-700 hover:text-emerald-800 shadow-lg hover:shadow-xl transition-all duration-300 px-6 py-3 rounded-2xl font-bold flex items-center space-x-3 hover:scale-105 transform"
      >
        <Download className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
        <span>{isExporting ? 'Exporting...' : 'Export CSV'}</span>
      </Button>
      {hasActiveFilters && (
        <p className="text-sm text-gray-600 font-medium bg-gray-50 px-3 py-2 rounded-xl border border-gray-200">
          Export will include only filtered results
        </p>
      )}
    </div>
  );
}
