import { useEffect, useState } from 'react'
import { Calendar, DollarSign, MapPin, TrendingUp } from 'lucide-react'
import StatsCard from '../components/cards/StatsCard'
import DataTable from '../components/table/DataTable'
import { formatCurrency, formatDateTime } from '../utils/formatters'
import { STATUS_COLORS } from '../utils/constants'
import { dashboardService } from '../services/dashboardService'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [recentBookings, setRecentBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, bookingsData] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getRecentBookings()
        ])
        setStats(statsData)
        setRecentBookings(bookingsData)
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])
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
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[row.status]}`}>
          {row.status}
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Today's Bookings"
              value={stats?.today_bookings || 0}
              icon={Calendar}
              color="primary"
            />
            <StatsCard
              title="Today's Revenue"
              value={formatCurrency(stats?.today_revenue || 0)}
              icon={DollarSign}
              color="success"
            />
            <StatsCard
              title="Total Revenue"
              value={formatCurrency(stats?.total_revenue || 0)}
              icon={TrendingUp}
              color="accent"
            />
            <StatsCard
              title="Active Turfs"
              value={stats?.active_turfs || 0}
              icon={MapPin}
              color="primary"
            />
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Bookings</span>
                <span className="font-semibold text-gray-900">{stats?.total_bookings || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Owners</span>
                <span className="font-semibold text-gray-900">{stats?.total_owners || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Players</span>
                <span className="font-semibold text-gray-900">{stats?.total_players || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Turfs</span>
                <span className="font-semibold text-gray-900">{stats?.total_turfs || 0}</span>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Bookings</h2>
            <DataTable columns={bookingColumns} data={recentBookings} />
          </div>
        </>
      )}
    </div>
  )
}
