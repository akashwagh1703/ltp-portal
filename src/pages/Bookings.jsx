import { useState } from 'react'
import { XCircle, Eye } from 'lucide-react'
import DataTable from '../components/table/DataTable'
import Button from '../components/ui/Button'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import Modal from '../components/ui/Modal'
import { useBookings, useCancelBooking } from '../api/hooks/useBookings'
import { formatCurrency, formatDate, formatPhone, formatDateTime } from '../utils/formatters'
import { STATUS_COLORS } from '../utils/constants'
import toast from 'react-hot-toast'

export default function Bookings() {
  const { data: bookings = [], isLoading } = useBookings()
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [cancelDialog, setCancelDialog] = useState({ isOpen: false, booking: null })
  
  const cancelMutation = useCancelBooking()

  const handleCancel = (booking) => {
    setCancelDialog({ isOpen: true, booking })
  }

  const confirmCancel = () => {
    cancelMutation.mutate({ 
      bookingId: cancelDialog.booking.id, 
      reason: 'Cancelled by admin' 
    }, {
      onSuccess: () => {
        toast.success('Booking cancelled successfully')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to cancel booking')
      }
    })
    setCancelDialog({ isOpen: false, booking: null })
  }

  const columns = [
    { key: 'booking_number', label: 'Booking #', sortable: true },
    { 
      key: 'turf', 
      label: 'Turf', 
      sortable: true,
      render: (row) => row.turf?.name || 'N/A'
    },
    { key: 'player_name', label: 'Player', sortable: true },
    { 
      key: 'player_phone', 
      label: 'Phone',
      render: (row) => formatPhone(row.player_phone)
    },
    { 
      key: 'booking_date', 
      label: 'Date',
      sortable: true,
      render: (row) => formatDate(row.booking_date)
    },
    { 
      key: 'time_slot', 
      label: 'Time',
      render: (row) => `${row.start_time} - ${row.end_time}`
    },
    { 
      key: 'amount', 
      label: 'Amount',
      sortable: true,
      render: (row) => formatCurrency(row.amount)
    },
    { 
      key: 'booking_type', 
      label: 'Type',
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          row.booking_type === 'online' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
        }`}>
          {row.booking_type}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          row.status === 'completed' ? 'bg-green-100 text-green-800' :
          row.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
          row.status === 'no_show' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {row.status === 'no_show' ? 'No Show' : row.status}
        </span>
      )
    },
    {
      key: 'payment_status',
      label: 'Payment',
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          row.payment_status === 'success' ? 'bg-green-100 text-green-800' :
          row.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          row.payment_status === 'failed' ? 'bg-red-100 text-red-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {row.payment_status}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex gap-1">
          <Button size="sm" variant="outline" onClick={() => setSelectedBooking(row)} title="View Details">
            <Eye className="h-4 w-4" />
          </Button>
          {row.status === 'confirmed' && (
            <Button size="sm" variant="danger" onClick={() => handleCancel(row)} title="Cancel">
              <XCircle className="h-4 w-4" />
            </Button>
          )}
        </div>
      )
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Booking Management</h1>
        <p className="text-gray-600 mt-1">View and manage all bookings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Total Bookings</p>
          <h3 className="text-2xl font-bold text-gray-900">{bookings.length}</h3>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Completed</p>
          <h3 className="text-2xl font-bold text-green-600">
            {bookings.filter(b => b.status === 'completed').length}
          </h3>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Confirmed</p>
          <h3 className="text-2xl font-bold text-blue-600">
            {bookings.filter(b => b.status === 'confirmed').length}
          </h3>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Cancelled</p>
          <h3 className="text-2xl font-bold text-red-600">
            {bookings.filter(b => b.status === 'cancelled').length}
          </h3>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">No Show</p>
          <h3 className="text-2xl font-bold text-yellow-600">
            {bookings.filter(b => b.status === 'no_show').length}
          </h3>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
          <h3 className="text-2xl font-bold text-green-600">
            {formatCurrency(bookings.filter(b => b.status === 'completed').reduce((sum, b) => sum + parseFloat(b.amount || 0), 0))}
          </h3>
        </div>
      </div>

      <DataTable columns={columns} data={bookings} loading={isLoading} />

      <ConfirmDialog
        isOpen={cancelDialog.isOpen}
        onClose={() => setCancelDialog({ isOpen: false, booking: null })}
        onConfirm={confirmCancel}
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking? This action cannot be undone."
        variant="danger"
      />

      <Modal
        isOpen={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        title="Booking Details"
        size="lg"
      >
        {selectedBooking && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Booking Number</p>
                <p className="font-medium">{selectedBooking.booking_number}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  selectedBooking.status === 'completed' ? 'bg-green-100 text-green-800' :
                  selectedBooking.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                  selectedBooking.status === 'no_show' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {selectedBooking.status === 'no_show' ? 'No Show' : selectedBooking.status}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Turf</p>
                <p className="font-medium">{selectedBooking.turf?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Owner</p>
                <p className="font-medium">{selectedBooking.owner?.name || selectedBooking.turf?.owner?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Owner Phone</p>
                <p className="font-medium">{selectedBooking.owner?.phone || selectedBooking.turf?.owner?.phone || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Player</p>
                <p className="font-medium">{selectedBooking.player_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium">{formatPhone(selectedBooking.player_phone)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Booking Date</p>
                <p className="font-medium">{formatDate(selectedBooking.booking_date)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Time Slot</p>
                <p className="font-medium">{selectedBooking.start_time} - {selectedBooking.end_time}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Amount</p>
                <p className="font-medium">{formatCurrency(selectedBooking.amount)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Booking Type</p>
                <p className="font-medium capitalize">{selectedBooking.booking_type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Payment Status</p>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  selectedBooking.payment_status === 'success' ? 'bg-green-100 text-green-800' :
                  selectedBooking.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  selectedBooking.payment_status === 'failed' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {selectedBooking.payment_status}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Created At</p>
                <p className="font-medium">{formatDateTime(selectedBooking.created_at)}</p>
              </div>
              {selectedBooking.cancelled_at && (
                <>
                  <div>
                    <p className="text-sm text-gray-600">Cancelled At</p>
                    <p className="font-medium">{formatDateTime(selectedBooking.cancelled_at)}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600">Cancellation Reason</p>
                    <p className="font-medium">{selectedBooking.cancellation_reason || 'N/A'}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
