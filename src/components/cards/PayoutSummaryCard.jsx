import { DollarSign, TrendingUp, Clock, CheckCircle } from 'lucide-react'
import { formatCurrency } from '../../utils/formatters'

export default function PayoutSummaryCard({ payouts }) {
  const stats = {
    total: payouts.length,
    pending: payouts.filter(p => p.status === 'pending').length,
    processed: payouts.filter(p => p.status === 'processed').length,
    paid: payouts.filter(p => p.status === 'paid').length,
    pendingAmount: payouts.filter(p => p.status === 'pending').reduce((sum, p) => sum + parseFloat(p.payout_amount || 0), 0),
    totalCommission: payouts.reduce((sum, p) => sum + parseFloat(p.commission_amount || 0), 0)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-blue-100 text-sm">Pending Actions</p>
            <h3 className="text-2xl font-bold">{stats.pending + stats.processed}</h3>
            <p className="text-blue-100 text-xs mt-1">Requires attention</p>
          </div>
          <Clock className="h-8 w-8 text-blue-200" />
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-green-100 text-sm">Pending Amount</p>
            <h3 className="text-2xl font-bold">{formatCurrency(stats.pendingAmount)}</h3>
            <p className="text-green-100 text-xs mt-1">To be released</p>
          </div>
          <DollarSign className="h-8 w-8 text-green-200" />
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-100 text-sm">Total Commission</p>
            <h3 className="text-2xl font-bold">{formatCurrency(stats.totalCommission)}</h3>
            <p className="text-purple-100 text-xs mt-1">Platform earnings</p>
          </div>
          <TrendingUp className="h-8 w-8 text-purple-200" />
        </div>
      </div>

      <div className="bg-gradient-to-r from-gray-500 to-gray-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-100 text-sm">Completed</p>
            <h3 className="text-2xl font-bold">{stats.paid}</h3>
            <p className="text-gray-100 text-xs mt-1">Successfully paid</p>
          </div>
          <CheckCircle className="h-8 w-8 text-gray-200" />
        </div>
      </div>
    </div>
  )
}