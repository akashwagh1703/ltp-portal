import { motion } from 'framer-motion'
import { Zap, CreditCard, Bell, FileText, Users, Settings } from 'lucide-react'
import Button from '../ui/Button'
import { useNavigate } from 'react-router-dom'

export default function QuickActionsWidget() {
  const navigate = useNavigate()

  const actions = [
    {
      id: 1,
      title: 'Confirm LTP fees',
      description: 'Owner Pay LTP payments',
      icon: CreditCard,
      color: 'green',
      action: () => navigate('/subscriptions')
    },
    {
      id: 2,
      title: 'Send Notification',
      description: 'Broadcast to users',
      icon: Bell,
      color: 'blue',
      action: () => navigate('/notifications')
    },
    {
      id: 3,
      title: 'Review Applications',
      description: 'Pending owner requests',
      icon: FileText,
      color: 'orange',
      action: () => navigate('/owner-applications')
    },
    {
      id: 4,
      title: 'Manage Users',
      description: 'Owner & player accounts',
      icon: Users,
      color: 'purple',
      action: () => navigate('/owners')
    },
    {
      id: 5,
      title: 'Platform Settings',
      description: 'Configure system',
      icon: Settings,
      color: 'gray',
      action: () => navigate('/settings')
    }
  ]

  const getColorClasses = (color) => {
    const colors = {
      green: 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
      blue: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
      orange: 'from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700',
      purple: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700',
      gray: 'from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700'
    }
    return colors[color] || colors.blue
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-6">
        <Zap className="h-5 w-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
        {actions.map((action, index) => {
          const Icon = action.icon
          return (
            <motion.button
              key={action.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={action.action}
              className={`p-4 rounded-lg bg-gradient-to-r ${getColorClasses(action.color)} text-white text-left transition-all duration-200 shadow-sm hover:shadow-md`}
            >
              <div className="flex items-start gap-3">
                <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-sm">{action.title}</h4>
                  <p className="text-xs opacity-90 mt-1">{action.description}</p>
                </div>
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}