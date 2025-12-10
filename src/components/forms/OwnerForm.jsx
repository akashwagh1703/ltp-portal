import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { phoneSchema, emailSchema } from '../../utils/validators'
import { subscriptionService } from '../../services/subscriptionService'

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
  subscription_plan_id: z.string().min(1, 'Please select a subscription plan'),
  payment_method: z.string().min(1, 'Payment method is required'),
  transaction_id: z.string().optional()
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
  account_holder_name: z.string().optional()
})

export default function OwnerForm({ initialData, onSubmit, loading }) {
  const [plans, setPlans] = useState([])
  const [selectedPlan, setSelectedPlan] = useState(null)
  
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm({
    resolver: zodResolver(initialData ? editOwnerSchema : createOwnerSchema),
    defaultValues: initialData || { payment_method: 'cash' }
  })

  const planId = watch('subscription_plan_id')

  useEffect(() => {
    loadPlans()
  }, [])

  useEffect(() => {
    if (planId) {
      const plan = plans.find(p => p.id.toString() === planId)
      setSelectedPlan(plan)
    }
  }, [planId, plans])

  const loadPlans = async () => {
    try {
      const response = await subscriptionService.getPlans()
      setPlans(response.data)
    } catch (error) {
      console.error('Error loading plans:', error)
    }
  }

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

      {!initialData && (
        <>
          <div className="bg-purple-50 p-3 rounded-lg mb-4 mt-6">
            <h4 className="font-semibold text-sm text-gray-900 mb-1">Subscription & Payment</h4>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subscription Plan
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              {...register('subscription_plan_id')}
            >
              <option value="">Select Plan</option>
              {plans.map(plan => (
                <option key={plan.id} value={plan.id}>
                  {plan.name} - ₹{plan.price} ({plan.duration_days} days)
                </option>
              ))}
            </select>
            {errors.subscription_plan_id && (
              <p className="mt-1 text-sm text-red-600">{errors.subscription_plan_id.message}</p>
            )}
          </div>

          {selectedPlan && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-gray-900">Plan Details:</p>
              <p className="text-sm text-gray-700">Type: {selectedPlan.type}</p>
              <p className="text-sm text-gray-700">Duration: {selectedPlan.duration_days} days</p>
              <p className="text-lg font-bold text-blue-600 mt-2">Amount: ₹{selectedPlan.price}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Method
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              {...register('payment_method')}
            >
              <option value="cash">Cash</option>
              <option value="online">Online</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="cheque">Cheque</option>
            </select>
            {errors.payment_method && (
              <p className="mt-1 text-sm text-red-600">{errors.payment_method.message}</p>
            )}
          </div>

          <Input
            label="Transaction ID (Optional)"
            placeholder="Enter transaction/reference ID"
            error={errors.transaction_id?.message}
            {...register('transaction_id')}
          />
        </>
      )}

      <div className="flex gap-3 pt-4 sticky bottom-0 bg-white pb-2">
        <Button type="submit" loading={loading} className="flex-1">
          {initialData ? 'Update Owner' : 'Add Owner'}
        </Button>
      </div>
    </form>
  )
}
