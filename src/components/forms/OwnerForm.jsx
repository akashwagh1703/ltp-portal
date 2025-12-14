import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { phoneSchema, emailSchema } from '../../utils/validators'

const createOwnerSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  email: emailSchema.optional().or(z.literal('')),
  phone: phoneSchema,
  address: z.string().optional(),
  pan_number: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format (e.g., ABCDE1234F)').optional().or(z.literal('')),
  bank_name: z.string().optional(),
  account_number: z.string().regex(/^\d{9,18}$/, 'Account number must be 9-18 digits').optional().or(z.literal('')),
  ifsc_code: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC code').optional().or(z.literal('')),
  account_holder_name: z.string().optional(),
  commission_rate: z.string().optional().transform(val => val === '' ? null : parseFloat(val))
})

const editOwnerSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  email: emailSchema.optional().or(z.literal('')),
  phone: phoneSchema,
  address: z.string().optional(),
  pan_number: z.string().regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format (e.g., ABCDE1234F)').optional().or(z.literal('')),
  bank_name: z.string().optional(),
  account_number: z.string().regex(/^\d{9,18}$/, 'Account number must be 9-18 digits').optional().or(z.literal('')),
  ifsc_code: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid IFSC code').optional().or(z.literal('')),
  account_holder_name: z.string().optional(),
  commission_rate: z.string().optional().transform(val => val === '' ? null : parseFloat(val))
})

export default function OwnerForm({ initialData, onSubmit, loading }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(initialData ? editOwnerSchema : createOwnerSchema),
    defaultValues: initialData || {}
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
      <div className="bg-blue-50 p-3 rounded-lg mb-4">
        <h4 className="font-semibold text-sm text-gray-900 mb-1">Personal Information</h4>
      </div>

      <Input
        label="Owner Name"
        placeholder="Enter owner name"
        error={errors.name?.message}
        {...register('name')}
      />

      <Input
        label="Email"
        type="email"
        placeholder="owner@example.com"
        error={errors.email?.message}
        {...register('email')}
      />

      <Input
        label="Phone Number"
        type="text"
        placeholder="9876543210"
        error={errors.phone?.message}
        {...register('phone')}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Address
        </label>
        <textarea
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Enter complete address"
          rows="3"
          {...register('address')}
        />
        {errors.address && (
          <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
        )}
      </div>

      <div className="bg-green-50 p-3 rounded-lg mb-4 mt-6">
        <h4 className="font-semibold text-sm text-gray-900 mb-1">Tax Information</h4>
      </div>

      <Input
        label="PAN Number"
        type="text"
        placeholder="ABCDE1234F"
        error={errors.pan_number?.message}
        {...register('pan_number')}
      />

      <div className="bg-orange-50 p-3 rounded-lg mb-4 mt-6">
        <h4 className="font-semibold text-sm text-gray-900 mb-1">Bank Details (For Payouts)</h4>
      </div>

      <Input
        label="Bank Name"
        placeholder="HDFC Bank"
        error={errors.bank_name?.message}
        {...register('bank_name')}
      />

      <Input
        label="Account Holder Name"
        placeholder="As per bank records"
        error={errors.account_holder_name?.message}
        {...register('account_holder_name')}
      />

      <Input
        label="Account Number"
        type="text"
        placeholder="123456789012"
        error={errors.account_number?.message}
        {...register('account_number')}
      />

      <Input
        label="IFSC Code"
        type="text"
        placeholder="HDFC0001234"
        error={errors.ifsc_code?.message}
        {...register('ifsc_code')}
      />

      <div className="bg-yellow-50 p-3 rounded-lg mb-4 mt-6">
        <h4 className="font-semibold text-sm text-gray-900 mb-1">Commission Settings</h4>
        <p className="text-xs text-gray-600 mt-1">Leave empty to use platform default (5%)</p>
      </div>

      <Input
        label="Custom Commission Rate (%)"
        type="number"
        step="0.01"
        min="0"
        max="100"
        placeholder="e.g., 3 for 3%, 7 for 7%"
        error={errors.commission_rate?.message}
        {...register('commission_rate')}
      />

      {!initialData && (
        <div className="bg-green-50 p-4 rounded-lg mb-4 mt-6">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="font-semibold text-sm text-gray-900">Free Subscription Included</h4>
              <p className="text-xs text-gray-700 mt-1">New owners automatically get a 90-day free subscription plan</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-3 pt-4 sticky bottom-0 bg-white pb-2">
        <Button type="submit" loading={loading} className="flex-1">
          {initialData ? 'Update Owner' : 'Add Owner'}
        </Button>
      </div>
    </form>
  )
}
