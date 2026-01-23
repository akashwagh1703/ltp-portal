import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'

export default function MetricCard({ 
  title, 
  value, 
  previousValue, 
  icon: Icon, 
  color = 'blue',
  format = 'number',
  suffix = ''
}) {
  const [animatedValue, setAnimatedValue] = useState(0)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValue(value)
    }, 100)
    return () => clearTimeout(timer)
  }, [value])

  const formatValue = (val) => {
    if (format === 'currency') return `₹${val.toLocaleString()}`
    if (format === 'percentage') return `${val}%`
    return val.toLocaleString()
  }

  const getGrowth = () => {
    if (!previousValue || previousValue === 0) return null
    const growth = ((value - previousValue) / previousValue) * 100
    return growth
  }

  const growth = getGrowth()
  const isPositive = growth > 0
  const isNegative = growth < 0

  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
    red: 'from-red-500 to-red-600'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 relative overflow-hidden"
    >
      <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${colorClasses[color]} opacity-10 rounded-full -mr-10 -mt-10`} />
      
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <motion.h3 
            className="text-2xl font-bold text-gray-900"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            {formatValue(animatedValue)}{suffix}
          </motion.h3>
          
          {growth !== null && (
            <div className={`flex items-center mt-2 text-sm ${
              isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-gray-500'
            }`}>
              {isPositive && <TrendingUp className="h-4 w-4 mr-1" />}
              {isNegative && <TrendingDown className="h-4 w-4 mr-1" />}
              <span>{Math.abs(growth).toFixed(1)}% vs last month</span>
            </div>
          )}
        </div>
        
        <div className={`p-3 rounded-lg bg-gradient-to-br ${colorClasses[color]}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </motion.div>
  )
}