import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Input from '../ui/Input'
import Button from '../ui/Button'
import { priceSchema, commissionSchema } from '../../utils/validators'

const payoutSchema = z.object({
  total_amount: priceSchema,
  commission: commissionSchema
})

export default function PayoutForm({ initialData, onSubmit, loading }) {
  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    resolver: zodResolver(payoutSchema),
    defaultValues: initialData || {}
  })

  const totalAmount = watch('total_amount')
  const commission = watch('commission')
  
  const calculateSettlement = () => {
    if (!totalAmount || !commission) return 0
    const total = parseInt(totalAmount)
    const comm = parseInt(commission)
    return total - (total * comm / 100)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Total Amount (₹)"
        type="text"
        placeholder="50000"
        error={errors.total_amount?.message}
        {...register('total_amount')}
      />

      <Input
        label="Commission (%)"
        type="text"
        placeholder="10"
        error={errors.commission?.message}
        {...register('commission')}
      />

      {totalAmount && commission && (
        <div className="bg-primary-light p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Settlement Amount</p>
          <p className="text-2xl font-bold text-primary">
            ₹{calculateSettlement().toLocaleString('en-IN')}
          </p>
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <Button type="submit" loading={loading} className="flex-1">
          Calculate Payout
        </Button>
      </div>
    </form>
  )
}
