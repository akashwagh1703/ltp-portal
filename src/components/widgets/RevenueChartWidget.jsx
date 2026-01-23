import { motion } from 'framer-motion'
import { TrendingUp, Calendar } from 'lucide-react'

export default function RevenueChartWidget({ data = [], period = '7 days' }) {
  const maxValue = Math.max(...data.map(d => d.value))
  
  const formatCurrency = (value) => `₹${value.toLocaleString()}`
  
  const totalRevenue = data.reduce((sum, d) => sum + d.value, 0)
  const avgRevenue = totalRevenue / data.length || 0

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Revenue Trend</h3>
          <p className="text-sm text-gray-500">Last {period}</p>
        </div>
        <div className="flex items-center gap-2 text-green-600">
          <TrendingUp className="h-4 w-4" />
          <span className="text-sm font-medium">+12.5%</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-sm text-gray-600">Total Revenue</p>
          <p className="text-xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Daily Average</p>
          <p className="text-xl font-bold text-gray-900">{formatCurrency(avgRevenue)}</p>
        </div>
      </div>

      <div className="relative h-32">
        <div className="flex items-end justify-between h-full gap-1">
          {data.map((item, index) => (
            <motion.div
              key={index}
              initial={{ height: 0 }}
              animate={{ height: `${(item.value / maxValue) * 100}%` }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-sm flex-1 min-h-[4px] relative group"
            >
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {formatCurrency(item.value)}
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          {data.map((item, index) => (
            <span key={index} className="flex-1 text-center">
              {item.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}