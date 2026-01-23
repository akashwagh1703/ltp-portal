import { motion } from 'framer-motion'
import { AlertCircle, Clock, DollarSign, UserPlus, FileText } from 'lucide-react'
import Button from '../ui/Button'
import { useNavigate } from 'react-router-dom'

export default function PendingActionsWidget({ actions = [] }) {
  const navigate = useNavigate()

  const getIcon = (type) => {
    const icons = {
      payout: DollarSign,
      application: UserPlus,
      review: FileText,
      booking: Clock
    }
    return icons[type] || AlertCircle
  }

  const getColor = (priority) => {
    const colors = {
      high: 'text-red-600 bg-red-50',
      medium: 'text-yellow-600 bg-yellow-50',
      low: 'text-blue-600 bg-blue-50'
    }
    return colors[priority] || colors.medium
  }

  if (actions.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Actions</h3>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-gray-500">All caught up! No pending actions.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Pending Actions</h3>
        <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
          {actions.length}
        </span>
      </div>
      
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {actions.map((action, index) => {
          const Icon = getIcon(action.type)
          return (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${getColor(action.priority)}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{action.title}</p>
                  <p className="text-xs text-gray-500">{action.description}</p>
                </div>
              </div>
              <Button 
                size="xs" 
                variant="outline"
                onClick={() => navigate(action.link)}
              >
                View
              </Button>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}