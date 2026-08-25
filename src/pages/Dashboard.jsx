import { useEffect, useState } from 'react'
import { Calendar, DollarSign, MapPin, TrendingUp, Users, Clock, Zap } from 'lucide-react'
import MetricCard from '../components/cards/MetricCard'
import PendingActionsWidget from '../components/widgets/PendingActionsWidget'
import RevenueChartWidget from '../components/widgets/RevenueChartWidget'
import QuickActionsWidget from '../components/widgets/QuickActionsWidget'
import TopTurfsWidget from '../components/widgets/TopTurfsWidget'
import DataTable from '../components/table/DataTable'
import { formatCurrency, formatDateTime } from '../utils/formatters'
import { STATUS_COLORS } from '../utils/constants'
import { dashboardService } from '../services/dashboardService'
import { motion } from 'framer-motion'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [recentBookings, setRecentBookings] = useState([])
  const [pendingActions, setPendingActions] = useState([])
  const [revenueData, setRevenueData] = useState([])
  const [topTurfs, setTopTurfs] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  useEffect(() => {
    fetchDashboardData()
    const interval = setInterval(fetchDashboardData, 30000) // Refresh every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [statsData, bookingsData, pendingData, topTurfsData, revenueData] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getRecentBookings(),
        dashboardService.getPendingActions().catch(() => []),
        dashboardService.getTopTurfs().catch(() => []),
        dashboardService.getRevenueChart('7d').catch(() => [])
      ])
      
      setStats(statsData)
      setRecentBookings(bookingsData)
      setPendingActions(pendingData)
      setTopTurfs(topTurfsData)
      setRevenueData(revenueData)
      
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }
  const bookingColumns = [
    { key: 'booking_number', label: 'ID', sortable: true },
    { key: 'turf', label: 'Turf', sortable: true, render: (row) => row.turf?.name },
    { key: 'player_name', label: 'Player', sortable: true },
    { 
      key: 'amount', 
      label: 'Amount', 
      sortable: true,
      render: (row) => formatCurrency(row.amount)
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[row.status || row.booking_status]}`}>
          {row.status || row.booking_status}
        </span>
      )
    },
    {
      key: 'created_at',
      label: 'Date',
      render: (row) => formatDateTime(row.created_at)
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-gray-600">Real-time business insights</p>
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Live • Updated {lastUpdated.toLocaleTimeString()}</span>
            </div>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={fetchDashboardData}
          className="flex items-center gap-2 px-4 py-2 bg-action text-white rounded-lg hover:bg-[#c45c18] transition-colors"
        >
          <Zap className="h-4 w-4" />
          Refresh
        </motion.button>
      </motion.div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
          <p className="text-gray-500 mt-4">Loading dashboard...</p>
        </div>
      ) : (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Today's Revenue"
              value={stats?.today_revenue || 0}
              previousValue={stats?.yesterday_revenue || 0}
              icon={DollarSign}
              color="green"
              format="currency"
            />
            <MetricCard
              title="Today's Bookings"
              value={stats?.today_bookings || 0}
              previousValue={stats?.yesterday_bookings || 0}
              icon={Calendar}
              color="blue"
            />
            <MetricCard
              title="Active Users"
              value={stats?.active_users || 0}
              previousValue={stats?.last_month_users || 0}
              icon={Users}
              color="purple"
            />
            <MetricCard
              title="Avg Response Time"
              value={stats?.avg_response_time || 120}
              previousValue={stats?.last_avg_response || 150}
              icon={Clock}
              color="orange"
              suffix="ms"
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Revenue Chart - Takes 2 columns */}
            <div className="lg:col-span-2">
              <RevenueChartWidget data={revenueData} period="7 days" />
            </div>
            
            {/* Pending Actions */}
            <div>
              <PendingActionsWidget actions={pendingActions} />
            </div>
          </div>

          {/* Secondary Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Actions */}
            <QuickActionsWidget />
            
            {/* Top Turfs */}
            <TopTurfsWidget turfs={topTurfs} />
          </div>

          {/* Recent Bookings Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100"
          >
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900">Recent Bookings</h2>
              <p className="text-gray-600 text-sm mt-1">Latest booking activity across all turfs</p>
            </div>
            <div className="p-6">
              <DataTable columns={bookingColumns} data={recentBookings.slice(0, 10)} />
            </div>
          </motion.div>
        </>
      )}
    </div>
  )
}
