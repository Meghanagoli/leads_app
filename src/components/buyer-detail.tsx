import { Buyer } from '@/lib/db';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface BuyerDetailProps {
  buyer: Buyer;
  isOwner: boolean;
}

export function BuyerDetail({ buyer, isOwner }: BuyerDetailProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New': return 'bg-blue-100 text-blue-800';
      case 'Qualified': return 'bg-green-100 text-green-800';
      case 'Contacted': return 'bg-yellow-100 text-yellow-800';
      case 'Visited': return 'bg-purple-100 text-purple-800';
      case 'Negotiation': return 'bg-orange-100 text-orange-800';
      case 'Converted': return 'bg-emerald-100 text-emerald-800';
      case 'Dropped': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Lead Information</h2>
          <Badge className={getStatusColor(buyer.status)}>
            {buyer.status}
          </Badge>
        </div>
      </div>
      
      <div className="px-6 py-4 space-y-6">
        {/* Basic Information */}
        <div>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
            Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <p className="mt-1 text-sm text-gray-900">{buyer.fullName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <p className="mt-1 text-sm text-gray-900">{buyer.phone}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="mt-1 text-sm text-gray-900">{buyer.email || 'Not provided'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">City</label>
              <p className="mt-1 text-sm text-gray-900">{buyer.city}</p>
            </div>
          </div>
        </div>

        {/* Property Information */}
        <div>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
            Property Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Property Type</label>
              <p className="mt-1 text-sm text-gray-900">{buyer.propertyType}</p>
            </div>
            {buyer.bhk && (
              <div>
                <label className="block text-sm font-medium text-gray-700">BHK</label>
                <p className="mt-1 text-sm text-gray-900">{buyer.bhk} BHK</p>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700">Purpose</label>
              <p className="mt-1 text-sm text-gray-900">{buyer.purpose}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Timeline</label>
              <p className="mt-1 text-sm text-gray-900">{buyer.timeline}</p>
            </div>
          </div>
        </div>

        {/* Budget Information */}
        <div>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
            Budget Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Minimum Budget</label>
              <p className="mt-1 text-sm text-gray-900">
                {buyer.budgetMin ? formatCurrency(buyer.budgetMin) : 'Not specified'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Maximum Budget</label>
              <p className="mt-1 text-sm text-gray-900">
                {buyer.budgetMax ? formatCurrency(buyer.budgetMax) : 'Not specified'}
              </p>
            </div>
          </div>
        </div>

        {/* Lead Information */}
        <div>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
            Lead Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Source</label>
              <p className="mt-1 text-sm text-gray-900">{buyer.source}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Created</label>
              <p className="mt-1 text-sm text-gray-900">{formatDate(buyer.createdAt)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Updated</label>
              <p className="mt-1 text-sm text-gray-900">{formatDate(buyer.updatedAt)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Owner</label>
              <p className="mt-1 text-sm text-gray-900">
                {isOwner ? 'You' : 'Other user'}
              </p>
            </div>
          </div>
        </div>

        {/* Tags */}
        {buyer.tags && buyer.tags.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {buyer.tags.map((tag, index) => (
                <Badge key={index} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {buyer.notes && (
          <div>
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
              Notes
            </h3>
            <div className="bg-gray-50 rounded-md p-4">
              <p className="text-sm text-gray-900 whitespace-pre-wrap">{buyer.notes}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
