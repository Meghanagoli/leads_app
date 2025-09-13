'use client';

import { CsvImport } from './csv-import';
import { CsvExport } from './csv-export';
import { importCsv, exportCsv } from '@/lib/actions/csv';

interface CsvActionsProps {
  userId: string;
  currentFilters: {
    search: string;
    city: string;
    propertyType: string;
    status: string;
    timeline: string;
  };
}

export function CsvActions({ userId, currentFilters }: CsvActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
      <CsvImport onImport={(csvData) => importCsv(csvData, userId)} />
      <CsvExport 
        onExport={() => exportCsv(currentFilters)}
        currentFilters={currentFilters}
      />
    </div>
  );
}
