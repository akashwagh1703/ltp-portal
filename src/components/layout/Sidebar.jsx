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
  Star,
  UserPlus,
  ChevronDown,
  ChevronRight
} from 'lucide-react'
import { useState } from 'react'

const menuItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  {
    label: 'Turf Management',
    icon: MapPin,
    submenu: [
      { path: '/turfs', label: 'All Turfs' },
      { path: '/turf-update-requests', label: 'Update Requests' }
    ]
  },
  {
    label: 'User Management', 
    icon: Users,
    submenu: [
      { path: '/owner-applications', label: 'Owner Applications' },
      { path: '/owners', label: 'Turf Owners' },
      { path: '/players', label: 'Players' }
    ]
  },
  { path: '/bookings', icon: Calendar, label: 'Bookings' },
  { path: '/subscriptions', icon: CreditCard, label: 'Subscriptions' },
  {
    label: 'Marketing',
    icon: Tag,
    submenu: [
      { path: '/coupons', label: 'Coupons' },
      { path: '/reviews', label: 'Reviews' },
      { path: '/notifications', label: 'Send Notifications' }
    ]
  },
  { path: '/reports', icon: BarChart3, label: 'Reports' },
  { path: '/cms', icon: FileText, label: 'CMS' },
  { path: '/logs', icon: ScrollText, label: 'Logs' }
]

const bottomMenuItems = [
  { path: '/settings', icon: Settings, label: 'Settings' }
]

export default function Sidebar({ isOpen }) {
  const [openMenus, setOpenMenus] = useState({})

  const toggleSubmenu = (label) => {
    setOpenMenus(prev => ({
      ...prev,
      [label]: !prev[label]
    }))
  }

  const renderMenuItem = (item) => {
    if (item.submenu) {
      const isSubmenuOpen = openMenus[item.label]
      return (
        <div key={item.label}>
          <button
            onClick={() => toggleSubmenu(item.label)}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors text-gray-600 hover:bg-gray-100"
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            <motion.span
              animate={{ opacity: isOpen ? 1 : 0, display: isOpen ? 'block' : 'none' }}
              className="text-sm flex-1 text-left"
            >
              {item.label}
            </motion.span>
            {isOpen && (
              <motion.div
                animate={{ rotate: isSubmenuOpen ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronRight className="h-4 w-4" />
              </motion.div>
            )}
          </button>
          
          {isOpen && (
            <motion.div
              initial={false}
              animate={{ 
                height: isSubmenuOpen ? 'auto' : 0,
                opacity: isSubmenuOpen ? 1 : 0
              }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="ml-8 space-y-1 py-1">
                {item.submenu.map((subItem) => (
                  <NavLink
                    key={subItem.path}
                    to={subItem.path}
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-lg text-sm transition-colors ${
                        isActive
                          ? 'bg-primary-light text-primary font-medium'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`
                    }
                  >
                    {subItem.label}
                  </NavLink>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      )
    }

    return (
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
    )
  }

  return (
    <motion.aside
      initial={false}
      animate={{ width: isOpen ? 256 : 80 }}
      className="bg-white border-r border-gray-200 h-screen sticky top-0 flex flex-col"
    >
      <div className="p-6 flex-shrink-0">
        <motion.h1
          animate={{ opacity: isOpen ? 1 : 0 }}
          className="text-xl font-bold text-primary"
        >
          {isOpen ? "Let's Turf Play" : 'LTP'}
        </motion.h1>
      </div>
      
      <nav className="px-3 space-y-1 overflow-y-auto flex-1 pb-6 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-100">
        {menuItems.map(renderMenuItem)}
      </nav>
      
      <div className="px-3 pb-6 border-t border-gray-200 pt-3">
        {bottomMenuItems.map(renderMenuItem)}
      </div>
    </motion.aside>
  )
}
