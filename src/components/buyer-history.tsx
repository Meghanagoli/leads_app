import { formatDate } from '@/lib/utils';
import { Buyer } from '@/lib/db';

interface HistoryEntry {
  id: string;
  changedAt: Date;
  diff: Record<string, { old: any; new: any }>;
  changedBy: string;
  changedByName?: string | null;
}

interface BuyerHistoryProps {
  history: HistoryEntry[];
}

export function BuyerHistory({ history }: BuyerHistoryProps) {
  if (history.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Changes</h2>
        <p className="text-gray-500 text-sm">No changes recorded yet.</p>
      </div>
    );
  }

  const formatFieldName = (field: string) => {
    const fieldMap: Record<string, string> = {
      fullName: 'Full Name',
      email: 'Email',
      phone: 'Phone',
      city: 'City',
      propertyType: 'Property Type',
      bhk: 'BHK',
      purpose: 'Purpose',
      budgetMin: 'Minimum Budget',
      budgetMax: 'Maximum Budget',
      timeline: 'Timeline',
      source: 'Source',
      status: 'Status',
      notes: 'Notes',
      tags: 'Tags',
      created: 'Created',
    };
    return fieldMap[field] || field;
  };

  const formatValue = (value: any, field: string) => {
    if (value === null || value === undefined) {
      return 'Not set';
    }
    
    if (field === 'budgetMin' || field === 'budgetMax') {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
      }).format(value);
    }
    
    if (field === 'tags' && Array.isArray(value)) {
      return value.join(', ');
    }
    
    return String(value);
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Recent Changes</h2>
      </div>
      
      <div className="px-6 py-4">
        <div className="flow-root">
          <ul className="-mb-8">
            {history.map((entry, entryIdx) => (
              <li key={entry.id}>
                <div className="relative pb-8">
                  {entryIdx !== history.length - 1 ? (
                    <span
                      className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                      aria-hidden="true"
                    />
                  ) : null}
                  <div className="relative flex space-x-3">
                    <div>
                      <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                        <svg
                          className="h-5 w-5 text-white"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <div className="text-sm text-gray-500">
                          {formatDate(entry.changedAt)}
                        </div>
                        <div className="mt-1 text-sm text-gray-900">
                          {Object.entries(entry.diff).map(([field, change], idx) => (
                            <div key={field} className={idx > 0 ? 'mt-2' : ''}>
                              <span className="font-medium">{formatFieldName(field)}</span>
                              {change.old !== null && change.old !== undefined ? (
                                <span className="text-gray-600">
                                  {' '}changed from{' '}
                                  <span className="font-mono bg-red-100 px-1 rounded">
                                    {formatValue(change.old, field)}
                                  </span>
                                  {' '}to{' '}
                                  <span className="font-mono bg-green-100 px-1 rounded">
                                    {formatValue(change.new, field)}
                                  </span>
                                </span>
                              ) : (
                                <span className="text-gray-600">
                                  {' '}set to{' '}
                                  <span className="font-mono bg-green-100 px-1 rounded">
                                    {formatValue(change.new, field)}
                                  </span>
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="text-right text-sm whitespace-nowrap text-gray-500">
                        {entry.changedByName || 'System'}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
