import { BarChart3, TrendingUp, Users } from 'lucide-react';
import { db } from '@/lib/db';
import { buyers } from '@/lib/db/schema';
import { count, sql } from 'drizzle-orm';

async function getAnalyticsData() {
  try {
    // Get total leads count
    const totalLeads = await db.select({ count: count() }).from(buyers);
    
    // Get leads by status
    const leadsByStatus = await db
      .select({ 
        status: buyers.status, 
        count: count() 
      })
      .from(buyers)
      .groupBy(buyers.status);
    
    // Get leads by source
    const leadsBySource = await db
      .select({ 
        source: buyers.source, 
        count: count() 
      })
      .from(buyers)
      .groupBy(buyers.source);
    
    // Get leads by property type
    const leadsByPropertyType = await db
      .select({ 
        propertyType: buyers.propertyType, 
        count: count() 
      })
      .from(buyers)
      .groupBy(buyers.propertyType);
    
    // Get leads by city
    const leadsByCity = await db
      .select({ 
        city: buyers.city, 
        count: count() 
      })
      .from(buyers)
      .groupBy(buyers.city);
    
    // Get converted leads count
    const convertedLeads = await db
      .select({ count: count() })
      .from(buyers)
      .where(sql`${buyers.status} = 'Converted'`);
    
    // Get active leads (not converted or dropped)
    const activeLeads = await db
      .select({ count: count() })
      .from(buyers)
      .where(sql`${buyers.status} NOT IN ('Converted', 'Dropped')`);

    return {
      totalLeads: totalLeads[0]?.count || 0,
      convertedLeads: convertedLeads[0]?.count || 0,
      activeLeads: activeLeads[0]?.count || 0,
      leadsByStatus,
      leadsBySource,
      leadsByPropertyType,
      leadsByCity
    };
  } catch (error) {
    console.error('Error fetching analytics data:', error);
    return {
      totalLeads: 0,
      convertedLeads: 0,
      activeLeads: 0,
      leadsByStatus: [],
      leadsBySource: [],
      leadsByPropertyType: [],
      leadsByCity: []
    };
  }
}

export default async function AnalyticsPage() {
  const analyticsData = await getAnalyticsData();
  
  const conversionRate = analyticsData.totalLeads > 0 
    ? ((analyticsData.convertedLeads / analyticsData.totalLeads) * 100).toFixed(1)
    : '0.0';
  return (
    <div className="space-y-8">
        {/* Header */}
        <div className="bg-gradient-to-br from-white via-sky-50/30 to-white rounded-3xl p-10 shadow-xl border border-sky-100/50 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-sky-100/20 to-transparent rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-sky-100/20 to-transparent rounded-full translate-y-24 -translate-x-24"></div>
          
          <div className="relative">
            <div className="flex items-center space-x-4 mb-6">
              <div className="p-3 bg-gradient-to-br from-sky-400 to-sky-500 rounded-2xl shadow-lg">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-sky-500 via-sky-600 to-sky-700 bg-clip-text text-transparent">
                  Analytics Dashboard
                </h1>
                <p className="text-lg text-gray-600 font-medium">Comprehensive insights into your lead management</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-sky-100/50 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Leads</p>
                <p className="text-3xl font-bold text-sky-600 mt-2">{analyticsData.totalLeads}</p>
                <p className="text-sm text-gray-500 font-medium mt-1">All time leads</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-sky-100 to-sky-200 rounded-2xl">
                <Users className="h-8 w-8 text-sky-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-sky-100/50 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Conversion Rate</p>
                <p className="text-3xl font-bold text-emerald-600 mt-2">{conversionRate}%</p>
                <p className="text-sm text-gray-500 font-medium mt-1">Success rate</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl">
                <TrendingUp className="h-8 w-8 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-sky-100/50 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Active Leads</p>
                <p className="text-3xl font-bold text-orange-600 mt-2">{analyticsData.activeLeads}</p>
                <p className="text-sm text-gray-500 font-medium mt-1">In pipeline</p>
              </div>
              <div className="p-3 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl">
                <BarChart3 className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-sky-100/50">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Lead Sources</h3>
            <div className="space-y-4">
              {analyticsData.leadsBySource.length > 0 ? (
                analyticsData.leadsBySource.map((source, index) => {
                  const percentage = analyticsData.totalLeads > 0 
                    ? ((source.count / analyticsData.totalLeads) * 100).toFixed(1)
                    : '0.0';
                  const colors = ['sky', 'emerald', 'purple', 'orange', 'pink'];
                  const colorClass = colors[index % colors.length];
                  
                  return (
                    <div key={source.source} className={`flex items-center justify-between p-4 bg-${colorClass}-50 rounded-2xl`}>
                      <span className="font-medium text-gray-700">{source.source}</span>
                      <span className={`text-${colorClass}-600 font-bold`}>{source.count} ({percentage}%)</span>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No lead source data available</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-sky-100/50">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Property Types</h3>
            <div className="space-y-4">
              {analyticsData.leadsByPropertyType.length > 0 ? (
                analyticsData.leadsByPropertyType.map((property, index) => {
                  const percentage = analyticsData.totalLeads > 0 
                    ? ((property.count / analyticsData.totalLeads) * 100).toFixed(1)
                    : '0.0';
                  const colors = ['sky', 'emerald', 'purple', 'orange', 'pink'];
                  const colorClass = colors[index % colors.length];
                  
                  return (
                    <div key={property.propertyType} className={`flex items-center justify-between p-4 bg-${colorClass}-50 rounded-2xl`}>
                      <span className="font-medium text-gray-700">{property.propertyType}</span>
                      <span className={`text-${colorClass}-600 font-bold`}>{property.count} ({percentage}%)</span>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No property type data available</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-sky-100/50">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Lead Status Breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {analyticsData.leadsByStatus.length > 0 ? (
              analyticsData.leadsByStatus.map((status, index) => {
                const percentage = analyticsData.totalLeads > 0 
                  ? ((status.count / analyticsData.totalLeads) * 100).toFixed(1)
                  : '0.0';
                const colors = ['sky', 'emerald', 'purple', 'orange', 'pink', 'indigo', 'red'];
                const colorClass = colors[index % colors.length];
                
                return (
                  <div key={status.status} className={`p-4 bg-${colorClass}-50 rounded-2xl text-center`}>
                    <p className="font-medium text-gray-700 mb-1">{status.status}</p>
                    <p className={`text-2xl font-bold text-${colorClass}-600`}>{status.count}</p>
                    <p className={`text-sm text-${colorClass}-500`}>{percentage}%</p>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                <p>No status data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Coming Soon Notice */}
        <div className="bg-gradient-to-r from-sky-100 to-sky-200 rounded-3xl p-8 text-center">
          <h3 className="text-2xl font-bold text-sky-800 mb-4">🚀 Advanced Analytics Coming Soon!</h3>
          <p className="text-sky-700 font-medium">
            We&apos;re working on comprehensive charts, detailed reports, and advanced insights to help you make data-driven decisions.
          </p>
        </div>
    </div>
  );
}
