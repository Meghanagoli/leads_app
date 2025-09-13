import { clearAllData } from '@/lib/actions/clear-data';
import { Button } from '@/components/ui/button';

export default function ClearDataPage() {
  return (
    <div className="max-w-md mx-auto mt-20">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Clear All Data</h1>
        <p className="text-gray-600 mb-6">
          This will clear all buyers and history data. Use this to test the new timestamp functionality.
        </p>
        
        <form action={clearAllData}>
          <Button 
            type="submit" 
            variant="destructive"
            className="w-full"
          >
            Clear All Data
          </Button>
        </form>
      </div>
    </div>
  );
}
