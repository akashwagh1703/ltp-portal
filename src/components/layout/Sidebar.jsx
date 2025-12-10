import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, 
  MapPin, 
  Users, 
  Calendar, 
  DollarSign, 
  FileEdit,
  BarChart3,
  FileText,
  Settings,
  ScrollText,
  CreditCard,
  UserCircle,
  Tag,
  Star
} from 'lucide-react'

const menuItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/turfs', icon: MapPin, label: 'Turfs' },
  { path: '/owners', icon: Users, label: 'Owners' },
  { path: '/players', icon: UserCircle, label: 'Players' },
  { path: '/bookings', icon: Calendar, label: 'Bookings' },
  { path: '/payouts', icon: DollarSign, label: 'Payouts' },
  { path: '/subscriptions', icon: CreditCard, label: 'Subscriptions' },
  { path: '/coupons', icon: Tag, label: 'Coupons' },
  { path: '/reviews', icon: Star, label: 'Reviews' },
  { path: '/turf-update-requests', icon: FileEdit, label: 'Update Requests' },
  { path: '/reports', icon: BarChart3, label: 'Reports' },
  { path: '/cms', icon: FileText, label: 'CMS' },
  { path: '/logs', icon: ScrollText, label: 'Logs' },
  { path: '/settings', icon: Settings, label: 'Settings' }
]

export default function Sidebar({ isOpen }) {
  return (
    <motion.aside
      initial={false}
      animate={{ width: isOpen ? 256 : 80 }}
      className="bg-white border-r border-gray-200 h-screen sticky top-0 overflow-hidden"
    >
      <div className="p-6">
        <motion.h1
          animate={{ opacity: isOpen ? 1 : 0 }}
          className="text-xl font-bold text-primary"
        >
          {isOpen ? "Let's Turf Play" : 'LTP'}
        </motion.h1>
      </div>
      
      <nav className="px-3 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-light text-primary font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              }`
            }
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            <motion.span
              animate={{ opacity: isOpen ? 1 : 0, display: isOpen ? 'block' : 'none' }}
              className="text-sm"
            >
              {item.label}
            </motion.span>
          </NavLink>
        ))}
      </nav>
    </motion.aside>
  )
}
