import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function DashboardCard({ title, description, icon: Icon, color = 'primary', path }) {
  const navigate = useNavigate()

  const colorClasses = {
    primary: 'bg-primary-light border-primary',
    success: 'bg-green-100 border-success',
    danger: 'bg-red-100 border-danger',
    accent: 'bg-orange-100 border-accent'
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      onClick={() => path && navigate(path)}
      className={`${colorClasses[color]} border-2 rounded-xl p-6 cursor-pointer transition-shadow hover:shadow-lg`}
    >
      <div className="flex items-start justify-between mb-4">
        <Icon className="h-8 w-8 text-gray-700" />
        <ArrowRight className="h-5 w-5 text-gray-500" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </motion.div>
  )
}
