import { useState } from 'react'
import { Download, Calendar } from 'lucide-react'
import DataTable from '../components/table/DataTable'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import { useReports } from '../api/hooks/useReports'
import { formatCurrency, formatDate } from '../utils/formatters'
import toast from 'react-hot-toast'

export default function Reports() {
  const [reportType, setReportType] = useState('bookings')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  
  const { data: reportData, isLoading, refetch } = useReports(reportType, dateFrom, dateTo)

  const handleGenerateReport = () => {
    if (!dateFrom || !dateTo) {
      toast.error('Please select both start and end dates')
      return
    }
    refetch()
  }

  const handleExport = () => {
    toast.success('Export functionality coming soon')
  }

  const bookingColumns = [
    { key: 'booking_number', label: 'Booking ID', sortable: true },
    { 
      key: 'turf', 
      label: 'Turf',
      render: (row) => row.turf?.name || 'N/A'
    },
    { 
      key: 'player', 
      label: 'Player',
      render: (row) => row.player?.name || 'N/A'
    },
    { 
      key: 'booking_date', 
      label: 'Date',
      render: (row) => formatDate(row.booking_date)
    },
    { 
      key: 'amount', 
      label: 'Amount',
      render: (row) => formatCurrency(row.amount)
    },
    { key: 'payment_mode', label: 'Payment Mode' },
    { key: 'booking_status', label: 'Status' }
  ]

  const turfWiseColumns = [
    { 
      key: 'turf', 
      label: 'Turf',
      render: (row) => row.turf?.name || 'N/A'
    },
    { 
      key: 'total_bookings', 
      label: 'Total Bookings',
      sortable: true
    },
    { 
      key: 'total_revenue', 
      label: 'Total Revenue',
      sortable: true,
      render: (row) => formatCurrency(row.total_revenue)
    }
  ]

  const ownerWiseColumns = [
    { 
      key: 'owner', 
      label: 'Owner',
      render: (row) => row.owner?.name || 'N/A'
    },
    { 
      key: 'total_bookings', 
      label: 'Total Bookings',
      sortable: true
    },
    { 
      key: 'total_revenue', 
      label: 'Total Revenue',
      sortable: true,
      render: (row) => formatCurrency(row.total_revenue)
    }
  ]

  const paymentModeColumns = [
    { key: 'payment_method', label: 'Payment Method', sortable: true },
    { key: 'count', label: 'Count', sortable: true },
    { 
      key: 'total', 
      label: 'Total Amount',
      sortable: true,
      render: (row) => formatCurrency(row.total)
    }
  ]

  const getColumns = () => {
    switch(reportType) {
      case 'bookings':
        return bookingColumns
      case 'turf-wise':
        return turfWiseColumns
      case 'owner-wise':
        return ownerWiseColumns
      case 'payment-mode':
        return paymentModeColumns
      default:
        return bookingColumns
    }
  }

  const getData = () => {
    if (!reportData) return []
    
    switch(reportType) {
      case 'bookings':
        return reportData.bookings || []
      case 'turf-wise':
      case 'owner-wise':
      case 'payment-mode':
        return reportData || []
      default:
        return []
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-gray-600 mt-1">Generate and export various reports</p>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Select
            label="Report Type"
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
          >
            <option value="bookings">Booking Report</option>
            <option value="turf-wise">Turf-wise Report</option>
            <option value="owner-wise">Owner-wise Report</option>
            <option value="payment-mode">Payment Mode Report</option>
          </Select>

          <Input
            label="Start Date"
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />

          <Input
            label="End Date"
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />

          <div className="flex items-end gap-2">
            <Button onClick={handleGenerateReport} className="flex-1">
              <Calendar className="h-4 w-4 mr-2" />
              Generate
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {reportData && reportType === 'bookings' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-600 mb-1">Total Bookings</p>
            <h3 className="text-2xl font-bold text-gray-900">{reportData.total_bookings || 0}</h3>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
            <h3 className="text-2xl font-bold text-green-600">
              {formatCurrency(reportData.total_revenue || 0)}
            </h3>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <DataTable 
          columns={getColumns()} 
          data={getData()} 
          loading={isLoading}
        />
      </div>
    </div>
  )
}
