import { useState } from 'react'
import { Ban, Play, Eye } from 'lucide-react'
import DataTable from '../components/table/DataTable'
import Button from '../components/ui/Button'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import Modal from '../components/ui/Modal'
import { usePlayers, useUpdatePlayerStatus } from '../api/hooks/usePlayers'
import { formatPhone, formatDateTime, formatCurrency } from '../utils/formatters'
import { STATUS_COLORS } from '../utils/constants'
import toast from 'react-hot-toast'

export default function Players() {
  const { data: players = [], isLoading } = usePlayers()
  const [selectedPlayer, setSelectedPlayer] = useState(null)
  const [statusDialog, setStatusDialog] = useState({ isOpen: false, player: null, status: null })
  
  const updateStatusMutation = useUpdatePlayerStatus()

  const handleStatusChange = (player, status) => {
    setStatusDialog({ isOpen: true, player, status })
  }

  const confirmStatusChange = () => {
    const { player, status } = statusDialog
    updateStatusMutation.mutate(
      { playerId: player.id, status },
      {
        onSuccess: () => {
          toast.success(`Player ${status === 'active' ? 'activated' : status === 'suspended' ? 'suspended' : 'deactivated'} successfully`)
        },
        onError: (error) => {
          toast.error(error.response?.data?.message || 'Failed to update player status')
        }
      }
    )
    setStatusDialog({ isOpen: false, player: null, status: null })
  }

  const columns = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'name', label: 'Name', sortable: true },
    { 
      key: 'phone', 
      label: 'Phone',
      sortable: true,
      render: (row) => formatPhone(row.phone)
    },
    { 
      key: 'email', 
      label: 'Email', 
      sortable: true,
      render: (row) => row.email || 'N/A'
    },
    { 
      key: 'bookings_count', 
      label: 'Bookings',
      sortable: true,
      render: (row) => row.bookings_count || 0
    },
    { 
      key: 'total_spent', 
      label: 'Total Spent',
      sortable: true,
      render: (row) => formatCurrency(row.total_spent || 0)
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
      label: 'Joined',
      render: (row) => formatDateTime(row.created_at)
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex gap-1">
          <Button size="sm" variant="outline" onClick={() => setSelectedPlayer(row)} title="View Details">
            <Eye className="h-4 w-4" />
          </Button>
          {row.status === 'active' && (
            <Button size="sm" variant="danger" onClick={() => handleStatusChange(row, 'suspended')} title="Suspend">
              <Ban className="h-4 w-4" />
            </Button>
          )}
          {(row.status === 'suspended' || row.status === 'inactive') && (
            <Button size="sm" variant="success" onClick={() => handleStatusChange(row, 'active')} title="Activate">
              <Play className="h-4 w-4" />
            </Button>
          )}
        </div>
      )
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Player Management</h1>
          <p className="text-gray-600 mt-1">Manage all registered players</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Total Players</p>
          <h3 className="text-2xl font-bold text-gray-900">{players.length}</h3>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Active Players</p>
          <h3 className="text-2xl font-bold text-green-600">
            {players.filter(p => p.status === 'active').length}
          </h3>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Suspended</p>
          <h3 className="text-2xl font-bold text-red-600">
            {players.filter(p => p.status === 'suspended').length}
          </h3>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Total Bookings</p>
          <h3 className="text-2xl font-bold text-gray-900">
            {players.reduce((sum, p) => sum + (p.bookings_count || 0), 0)}
          </h3>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
          <h3 className="text-2xl font-bold text-green-600">
            {formatCurrency(players.reduce((sum, p) => sum + (p.total_spent || 0), 0))}
          </h3>
        </div>
      </div>

      <DataTable columns={columns} data={players} loading={isLoading} />

      <ConfirmDialog
        isOpen={statusDialog.isOpen}
        onClose={() => setStatusDialog({ isOpen: false, player: null, status: null })}
        onConfirm={confirmStatusChange}
        title={`${statusDialog.status === 'active' ? 'Activate' : statusDialog.status === 'suspended' ? 'Suspend' : 'Deactivate'} Player`}
        message={`Are you sure you want to ${statusDialog.status === 'active' ? 'activate' : statusDialog.status === 'suspended' ? 'suspend' : 'deactivate'} this player?`}
        variant={statusDialog.status === 'active' ? 'success' : 'danger'}
      />

      <Modal
        isOpen={!!selectedPlayer}
        onClose={() => setSelectedPlayer(null)}
        title="Player Details"
        size="lg"
      >
        {selectedPlayer && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Player ID</p>
                <p className="font-medium">{selectedPlayer.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[selectedPlayer.status]}`}>
                  {selectedPlayer.status}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium">{selectedPlayer.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium">{formatPhone(selectedPlayer.phone)}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{selectedPlayer.email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Bookings</p>
                <p className="font-medium">{selectedPlayer.bookings_count || 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="font-medium">{formatCurrency(selectedPlayer.total_spent || 0)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Last Booking</p>
                <p className="font-medium">{selectedPlayer.last_booking_date ? formatDateTime(selectedPlayer.last_booking_date) : 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Joined Date</p>
                <p className="font-medium">{formatDateTime(selectedPlayer.created_at)}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
