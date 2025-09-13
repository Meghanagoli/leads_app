'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createBuyerSchema, CreateBuyerData, cityOptions, propertyTypeOptions, bhkOptions, purposeOptions, timelineOptions, sourceOptions, statusOptions } from '@/lib/validations/buyer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface BuyerFormProps {
  onSubmit: (data: CreateBuyerData & { updatedAt?: Date }) => Promise<{ success: boolean; error?: string }>;
  initialData?: Partial<CreateBuyerData> & { updatedAt?: Date };
  isSubmitting?: boolean;
}

export function BuyerForm({ onSubmit, initialData, isSubmitting = false }: BuyerFormProps) {
  const [selectedPropertyType, setSelectedPropertyType] = useState(initialData?.propertyType || '');
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateBuyerData>({
    defaultValues: {
      fullName: initialData?.fullName || '',
      phone: initialData?.phone || '',
      city: initialData?.city || 'Chandigarh',
      propertyType: initialData?.propertyType || 'Apartment',
      purpose: initialData?.purpose || 'Buy',
      timeline: initialData?.timeline || '0-3m',
      source: initialData?.source || 'Website',
      status: initialData?.status || 'New',
      email: initialData?.email || '',
      bhk: initialData?.bhk,
      budgetMin: initialData?.budgetMin,
      budgetMax: initialData?.budgetMax,
      notes: initialData?.notes || '',
      tags: initialData?.tags || [],
    },
  });

  const watchedPropertyType = watch('propertyType');

  const handleFormSubmit = async (data: CreateBuyerData) => {
    // Prevent multiple submissions
    if (isFormSubmitting) return;
    
    setIsFormSubmitting(true);
    try {
      const result = await onSubmit({ ...data, updatedAt: initialData?.updatedAt });
      
      if (result.success) {
        // Don't show toast here - let the page handle it
        if (initialData) {
          // For updates, redirect to detail page with success param
          // We need to get the ID from the URL or pass it as a prop
          const currentPath = window.location.pathname;
          const buyerId = currentPath.split('/')[2]; // Extract ID from /buyers/[id]/edit
          router.push(`/buyers/${buyerId}?updated=true`);
        } else {
          // For new leads, redirect to list
          router.push('/buyers');
          toast.success('Lead created successfully! 🎉');
        }
      } else {
        toast.error(result.error || 'Failed to save lead. Please try again.');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('Failed to save lead. Please try again.');
    } finally {
      setIsFormSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="relative overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-indigo-600/5 to-purple-600/5 rounded-3xl"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-transparent rounded-full -translate-y-48 translate-x-48 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-indigo-400/10 to-transparent rounded-full translate-y-40 -translate-x-40 animate-pulse delay-1000"></div>
          
          <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-10 hover:shadow-3xl transition-all duration-500">
            {/* Enhanced Header */}
            <div className="mb-10 pb-8 border-b border-gray-200/30">
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <div className="p-4 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-3xl shadow-xl">
                    <Plus className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full animate-ping"></div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full"></div>
                </div>
                <div>
                  <h2 className="text-4xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    {initialData ? 'Edit Lead Information' : 'Create New Lead'}
                  </h2>
                  <p className="text-lg text-gray-400 font-medium mt-2">
                    {initialData ? 'Update the buyer&apos;s information below' : 'Enter the buyer&apos;s information below'}
                  </p>
                </div>
        </div>
      </div>
        
            <form onSubmit={handleSubmit(handleFormSubmit as any)} className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Full Name */}
                <div className="space-y-3">
                  <Label htmlFor="fullName" className="text-lg font-bold text-gray-400 flex items-center space-x-2">
                    <span>Full Name</span>
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="fullName"
                    {...register('fullName')}
                    className="h-14 rounded-2xl border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 hover:shadow-lg text-lg font-medium"
                    placeholder="Enter full name"
                    aria-invalid={errors.fullName ? 'true' : 'false'}
                  />
                  {errors.fullName && (
                    <p className="text-sm text-red-600 flex items-center space-x-2 font-medium">
                      <span className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center">⚠</span>
                      <span>{errors.fullName.message}</span>
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-lg font-bold text-gray-400">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    className="h-14 rounded-2xl border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 hover:shadow-lg text-lg font-medium"
                    placeholder="Enter email address"
                    aria-invalid={errors.email ? 'true' : 'false'}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-600 flex items-center space-x-2 font-medium">
                      <span className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center">⚠</span>
                      <span>{errors.email.message}</span>
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-3">
                  <Label htmlFor="phone" className="text-lg font-bold text-gray-400 flex items-center space-x-2">
                    <span>Phone Number</span>
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    {...register('phone')}
                    className="h-14 rounded-2xl border-2 border-gray-200 hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 hover:shadow-lg text-lg font-medium"
                    placeholder="Enter phone number"
                    aria-invalid={errors.phone ? 'true' : 'false'}
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-600 flex items-center space-x-2 font-medium">
                      <span className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center">⚠</span>
                      <span>{errors.phone.message}</span>
                    </p>
                  )}
                </div>

        {/* City */}
        <div className="space-y-2">
          <Label htmlFor="city" className="text-sm font-medium text-gray-500">
            City *
          </Label>
          <Select
            onValueChange={(value) => setValue('city', value as any)}
            defaultValue={initialData?.city}
          >
            <SelectTrigger className="h-11 rounded-lg border-gray-200 hover:border-gray-300 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all duration-200 hover:shadow-sm">
              <SelectValue placeholder="Select city" />
            </SelectTrigger>
            <SelectContent className="rounded-lg border border-gray-200 shadow-xl bg-white z-50 max-h-60 overflow-y-auto w-full min-w-[var(--radix-select-trigger-width)]">
              {cityOptions.map((city) => (
                <SelectItem key={city} value={city} className="py-2 hover:bg-sky-50 focus:bg-sky-50 cursor-pointer">
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.city && (
            <p className="text-sm text-red-600 flex items-center space-x-1">
              <span>⚠</span>
              <span>{errors.city.message}</span>
            </p>
          )}
        </div>

        {/* Property Type */}
        <div className="space-y-2">
          <Label htmlFor="propertyType" className="text-sm font-medium text-gray-500">
            Property Type *
          </Label>
          <Select
            onValueChange={(value) => {
              setValue('propertyType', value as any);
              setSelectedPropertyType(value);
              // Clear BHK if not applicable
              if (!['Apartment', 'Villa'].includes(value)) {
                setValue('bhk', undefined);
              }
            }}
            defaultValue={initialData?.propertyType}
          >
            <SelectTrigger className="h-11 rounded-lg border-gray-200 hover:border-gray-300 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all duration-200 hover:shadow-sm">
              <SelectValue placeholder="Select property type" />
            </SelectTrigger>
            <SelectContent className="rounded-lg border border-gray-200 shadow-xl bg-white z-50 max-h-60 overflow-y-auto w-full min-w-[var(--radix-select-trigger-width)]">
              {propertyTypeOptions.map((type) => (
                <SelectItem key={type} value={type} className="py-2 hover:bg-sky-50 focus:bg-sky-50 cursor-pointer">
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.propertyType && (
            <p className="text-sm text-red-600 flex items-center space-x-1">
              <span>⚠</span>
              <span>{errors.propertyType.message}</span>
            </p>
          )}
        </div>

        {/* BHK - Only for Apartment and Villa */}
        {['Apartment', 'Villa'].includes(watchedPropertyType) && (
          <div className="space-y-2">
            <Label htmlFor="bhk" className="text-sm font-medium text-gray-500">
              BHK Configuration *
            </Label>
            <Select
              onValueChange={(value) => setValue('bhk', value as any)}
              defaultValue={initialData?.bhk}
            >
              <SelectTrigger className="h-11 rounded-lg border-gray-200 hover:border-gray-300 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all duration-200 hover:shadow-sm">
                <SelectValue placeholder="Select BHK" />
              </SelectTrigger>
              <SelectContent className="rounded-lg border border-gray-200 shadow-xl bg-white z-50 max-h-60 overflow-y-auto w-full min-w-[var(--radix-select-trigger-width)]">
                {bhkOptions.map((bhk) => (
                  <SelectItem key={bhk} value={bhk} className="py-2 hover:bg-sky-50 focus:bg-sky-50 cursor-pointer">
                    {bhk} BHK
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.bhk && (
              <p className="text-sm text-red-600 flex items-center space-x-1">
                <span>⚠</span>
                <span>{errors.bhk.message}</span>
              </p>
            )}
          </div>
        )}

        {/* Purpose */}
        <div className="space-y-2">
          <Label htmlFor="purpose" className="text-sm font-medium text-gray-500">
            Purpose *
          </Label>
          <Select
            onValueChange={(value) => setValue('purpose', value as any)}
            defaultValue={initialData?.purpose}
          >
            <SelectTrigger className="h-11 rounded-lg border-gray-200 hover:border-gray-300 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all duration-200 hover:shadow-sm">
              <SelectValue placeholder="Select purpose" />
            </SelectTrigger>
            <SelectContent className="rounded-lg border border-gray-200 shadow-xl bg-white z-50 max-h-60 overflow-y-auto w-full min-w-[var(--radix-select-trigger-width)]">
              {purposeOptions.map((purpose) => (
                <SelectItem key={purpose} value={purpose} className="py-2 hover:bg-sky-50 focus:bg-sky-50 cursor-pointer">
                  {purpose}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.purpose && (
            <p className="text-sm text-red-600 flex items-center space-x-1">
              <span>⚠</span>
              <span>{errors.purpose.message}</span>
            </p>
          )}
        </div>

        {/* Timeline */}
        <div className="space-y-2">
          <Label htmlFor="timeline" className="text-sm font-medium text-gray-500">
            Timeline *
          </Label>
          <Select
            onValueChange={(value) => setValue('timeline', value as any)}
            defaultValue={initialData?.timeline}
          >
            <SelectTrigger className="h-11 rounded-lg border-gray-200 hover:border-gray-300 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all duration-200 hover:shadow-sm">
              <SelectValue placeholder="Select timeline" />
            </SelectTrigger>
            <SelectContent className="rounded-lg border border-gray-200 shadow-xl bg-white z-50 max-h-60 overflow-y-auto w-full min-w-[var(--radix-select-trigger-width)]">
              {timelineOptions.map((timeline) => (
                <SelectItem key={timeline} value={timeline} className="py-2 hover:bg-sky-50 focus:bg-sky-50 cursor-pointer">
                  {timeline}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.timeline && (
            <p className="text-sm text-red-600 flex items-center space-x-1">
              <span>⚠</span>
              <span>{errors.timeline.message}</span>
            </p>
          )}
        </div>

        {/* Source */}
        <div className="space-y-2">
          <Label htmlFor="source" className="text-sm font-medium text-gray-500">
            Lead Source *
          </Label>
          <Select
            onValueChange={(value) => setValue('source', value as any)}
            defaultValue={initialData?.source}
          >
            <SelectTrigger className="h-11 rounded-lg border-gray-200 hover:border-gray-300 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all duration-200 hover:shadow-sm">
              <SelectValue placeholder="Select lead source" />
            </SelectTrigger>
            <SelectContent className="rounded-lg border border-gray-200 shadow-xl bg-white z-50 max-h-60 overflow-y-auto w-full min-w-[var(--radix-select-trigger-width)]">
              {sourceOptions.map((source) => (
                <SelectItem key={source} value={source} className="py-2 hover:bg-sky-50 focus:bg-sky-50 cursor-pointer">
                  {source}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.source && (
            <p className="text-sm text-red-600 flex items-center space-x-1">
              <span>⚠</span>
              <span>{errors.source.message}</span>
            </p>
          )}
        </div>

        {/* Status */}
        <div className="space-y-2">
          <Label htmlFor="status" className="text-sm font-medium text-gray-500">
            Lead Status *
          </Label>
          <Select
            onValueChange={(value) => setValue('status', value as any)}
            defaultValue={initialData?.status || 'New'}
            value={watch('status') || initialData?.status || 'New'}
          >
            <SelectTrigger className="h-11 rounded-lg border-gray-200 hover:border-gray-300 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all duration-200 hover:shadow-sm">
              <SelectValue placeholder="Select lead status" />
            </SelectTrigger>
            <SelectContent className="rounded-lg border border-gray-200 shadow-xl bg-white z-50 max-h-60 overflow-y-auto w-full min-w-[var(--radix-select-trigger-width)]">
              {statusOptions.map((status) => (
                <SelectItem key={status} value={status} className="py-2 hover:bg-sky-50 focus:bg-sky-50 cursor-pointer">
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.status && (
            <p className="text-sm text-red-600 flex items-center space-x-1">
              <span>⚠</span>
              <span>{errors.status.message}</span>
            </p>
          )}
          {/* Hidden input to ensure react-hook-form registers the field */}
          <input type="hidden" {...register('status')} />
        </div>

        {/* Budget Min */}
        <div className="space-y-2">
          <Label htmlFor="budgetMin" className="text-sm font-medium text-gray-500">
            Minimum Budget (INR)
          </Label>
          <Input
            id="budgetMin"
            type="number"
            {...register('budgetMin', { valueAsNumber: true })}
            className="h-11 rounded-lg border-gray-200 hover:border-gray-300 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all duration-200 hover:shadow-sm"
            placeholder="Enter minimum budget"
            aria-invalid={errors.budgetMin ? 'true' : 'false'}
          />
          {errors.budgetMin && (
            <p className="text-sm text-red-600 flex items-center space-x-1">
              <span>⚠</span>
              <span>{errors.budgetMin.message}</span>
            </p>
          )}
        </div>

        {/* Budget Max */}
        <div className="space-y-2">
          <Label htmlFor="budgetMax" className="text-sm font-medium text-gray-500">
            Maximum Budget (INR)
          </Label>
          <Input
            id="budgetMax"
            type="number"
            {...register('budgetMax', { valueAsNumber: true })}
            className="h-11 rounded-lg border-gray-200 hover:border-gray-300 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all duration-200 hover:shadow-sm"
            placeholder="Enter maximum budget"
            aria-invalid={errors.budgetMax ? 'true' : 'false'}
          />
          {errors.budgetMax && (
            <p className="text-sm text-red-600 flex items-center space-x-1">
              <span>⚠</span>
              <span>{errors.budgetMax.message}</span>
            </p>
          )}
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="notes" className="text-sm font-medium text-gray-500">
          Additional Notes
        </Label>
        <Textarea
          id="notes"
          {...register('notes')}
          className="h-24 rounded-lg border-gray-200 hover:border-gray-300 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all duration-200 hover:shadow-sm resize-none"
          placeholder="Add any additional notes or requirements..."
          rows={3}
          aria-invalid={errors.notes ? 'true' : 'false'}
        />
        {errors.notes && (
          <p className="text-sm text-red-600 flex items-center space-x-1">
            <span>⚠</span>
            <span>{errors.notes.message}</span>
          </p>
        )}
      </div>

      {/* Tags */}
      <div className="space-y-2">
        <Label htmlFor="tags" className="text-sm font-medium text-gray-500">
          Tags (comma-separated)
        </Label>
                <Input
                  id="tags"
                  {...register('tags', {
                    setValueAs: (value: string | string[]) => {
                      if (!value) return undefined;
                      if (Array.isArray(value)) {
                        return value;
                      }
                      return value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
                    }
                  })}
                  className="h-11 rounded-lg border-gray-200 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-colors duration-200"
                  placeholder="e.g., urgent, premium, first-time-buyer"
                />
        <p className="text-xs text-gray-500">
          Separate multiple tags with commas
        </p>
      </div>

              <div className="flex justify-center pt-10 border-t border-gray-200/30">
                <Button 
                  type="submit" 
                  disabled={isSubmitting || isFormSubmitting}
                  className="group bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-700 text-white px-16 py-6 rounded-3xl font-bold text-xl transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {(isSubmitting || isFormSubmitting) ? (
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="animate-spin rounded-full h-6 w-6 border-4 border-white/30"></div>
                        <div className="animate-spin rounded-full h-6 w-6 border-4 border-white border-t-transparent absolute top-0 left-0"></div>
                      </div>
                      <span>{initialData ? 'Updating Lead...' : 'Creating Lead...'}</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3">
                      <Plus className="h-6 w-6 group-hover:rotate-90 transition-transform duration-300" />
                      <span>{initialData ? 'Update Lead' : 'Create Lead'}</span>
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
