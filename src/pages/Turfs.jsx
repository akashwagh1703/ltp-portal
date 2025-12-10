import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, XCircle, Ban, Play, Plus, Edit, Trash2, Image } from 'lucide-react'
import DataTable from '../components/table/DataTable'
import Button from '../components/ui/Button'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import Modal from '../components/ui/Modal'
import TurfForm from '../components/forms/TurfForm'
import { useTurfs, useApproveTurf, useRejectTurf, useSuspendTurf, useActivateTurf, useDeleteTurf } from '../api/hooks/useTurfs'
import { formatCurrency, formatDateTime } from '../utils/formatters'
import { STATUS_COLORS } from '../utils/constants'
import toast from 'react-hot-toast'

export default function Turfs() {
  const navigate = useNavigate()
  const { data: turfs = [], isLoading } = useTurfs()
  const [selectedTurf, setSelectedTurf] = useState(null)
  const [actionDialog, setActionDialog] = useState({ isOpen: false, type: null, turf: null })
  
  const approveMutation = useApproveTurf()
  const rejectMutation = useRejectTurf()
  const suspendMutation = useSuspendTurf()
  const activateMutation = useActivateTurf()
  const deleteMutation = useDeleteTurf()

  const handleAction = (type, turf) => {
    setActionDialog({ isOpen: true, type, turf })
  }

  const confirmAction = () => {
    const { type, turf } = actionDialog
    const turfId = turf.id
    
    switch(type) {
      case 'approve':
        approveMutation.mutate(turfId)
        break
      case 'reject':
        rejectMutation.mutate({ turfId, reason: 'Does not meet requirements' })
        break
      case 'suspend':
        suspendMutation.mutate({ turfId, reason: 'Policy violation' })
        break
      case 'activate':
        activateMutation.mutate(turfId)
        break
      case 'delete':
        deleteMutation.mutate(turfId)
        break
    }
    
    setActionDialog({ isOpen: false, type: null, turf: null })
  }

  const columns = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'sport_type', label: 'Sport', sortable: true },
    { 
      key: 'city', 
      label: 'City',
      sortable: true
    },
    { 
      key: 'owner', 
      label: 'Owner',
      sortable: true,
      render: (row) => row.owner?.name || 'N/A'
    },
    { 
      key: 'pricing', 
      label: 'Price',
      render: (row) => {
        if (row.pricing_type === 'uniform' && row.uniform_price) {
          return formatCurrency(row.uniform_price)
        }
        if (row.pricing && row.pricing.length > 0) {
          const minPrice = Math.min(...row.pricing.map(p => parseFloat(p.price)))
          const maxPrice = Math.max(...row.pricing.map(p => parseFloat(p.price)))
          return `${formatCurrency(minPrice)} - ${formatCurrency(maxPrice)}`
        }
        return 'N/A'
      }
    },
    { 
      key: 'size', 
      label: 'Size',
      render: (row) => row.size || 'N/A'
    },
    { 
      key: 'capacity', 
      label: 'Capacity',
      render: (row) => row.capacity ? `${row.capacity} players` : 'N/A'
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
      label: 'Created',
      render: (row) => formatDateTime(row.created_at)
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex gap-1">
          {row.status === 'pending' && (
            <>
              <Button size="sm" variant="success" onClick={() => handleAction('approve', row)} title="Approve">
                <CheckCircle className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="danger" onClick={() => handleAction('reject', row)} title="Reject">
                <XCircle className="h-4 w-4" />
              </Button>
            </>
          )}
          {row.status === 'approved' && (
            <Button size="sm" variant="danger" onClick={() => handleAction('suspend', row)} title="Suspend">
              <Ban className="h-4 w-4" />
            </Button>
          )}
          {row.status === 'suspended' && (
            <Button size="sm" variant="success" onClick={() => handleAction('activate', row)} title="Activate">
              <Play className="h-4 w-4" />
            </Button>
          )}
          <Button size="sm" variant="outline" onClick={() => navigate(`/turfs/edit/${row.id}`)} title="Edit">
            <Edit className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => navigate(`/turfs/${row.id}/images`)} title="Images">
            <Image className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => setSelectedTurf(row)} title="View Details">
            View
          </Button>
        </div>
      )
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Turf Management</h1>
          <p className="text-gray-600 mt-1">Manage all turfs and their status</p>
        </div>
        <Button onClick={() => navigate('/turfs/add')}>
          <Plus className="h-4 w-4 mr-2" />
          Add Turf
        </Button>
      </div>

      <DataTable columns={columns} data={turfs} loading={isLoading} />

      <ConfirmDialog
        isOpen={actionDialog.isOpen}
        onClose={() => setActionDialog({ isOpen: false, type: null, turf: null })}
        onConfirm={confirmAction}
        title={`${actionDialog.type?.charAt(0).toUpperCase() + actionDialog.type?.slice(1)} Turf`}
        message={`Are you sure you want to ${actionDialog.type} this turf?`}
        variant={actionDialog.type === 'approve' || actionDialog.type === 'activate' ? 'success' : 'danger'}
      />

      <Modal
        isOpen={!!selectedTurf}
        onClose={() => setSelectedTurf(null)}
        title="Turf Details"
        size="lg"
      >
        {selectedTurf && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium">{selectedTurf.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Sport Type</p>
                <p className="font-medium">{selectedTurf.sport_type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Price</p>
                <p className="font-medium">
                  {selectedTurf.pricing_type === 'uniform' && selectedTurf.uniform_price
                    ? formatCurrency(selectedTurf.uniform_price)
                    : selectedTurf.pricing && selectedTurf.pricing.length > 0
                    ? `${formatCurrency(Math.min(...selectedTurf.pricing.map(p => parseFloat(p.price))))} - ${formatCurrency(Math.max(...selectedTurf.pricing.map(p => parseFloat(p.price))))}`
                    : 'N/A'
                  }
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[selectedTurf.status]}`}>
                  {selectedTurf.status}
                </span>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-600">Address</p>
                <p className="font-medium">
                  {[selectedTurf.address_line1, selectedTurf.address_line2, selectedTurf.city, selectedTurf.state, selectedTurf.pincode]
                    .filter(Boolean)
                    .join(', ')}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Owner</p>
                <p className="font-medium">{selectedTurf.owner?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Owner Phone</p>
                <p className="font-medium">{selectedTurf.owner?.phone || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Size</p>
                <p className="font-medium">{selectedTurf.size}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Capacity</p>
                <p className="font-medium">{selectedTurf.capacity} players</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Timing</p>
                <p className="font-medium">{selectedTurf.opening_time} - {selectedTurf.closing_time}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Slot Duration</p>
                <p className="font-medium">{selectedTurf.slot_duration} minutes</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-600">Description</p>
                <p className="font-medium">{selectedTurf.description}</p>
              </div>
            </div>
            {selectedTurf.amenities && selectedTurf.amenities.length > 0 && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Amenities</p>
                <div className="flex flex-wrap gap-2">
                  {selectedTurf.amenities.map((amenity, idx) => (
                    <span key={idx} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      {amenity.amenity_name || amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {selectedTurf.images && selectedTurf.images.length > 0 && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Images</p>
                <div className="grid grid-cols-3 gap-2">
                  {selectedTurf.images.map((img, idx) => (
                    <img 
                      key={idx} 
                      src={`http://10.10.16.254:8000/storage/${img.image_path || img}`}
                      alt={`Turf ${idx + 1}`}
                      className="h-24 w-full object-cover rounded-lg"
                      onError={(e) => {
                        e.target.style.display = 'none'
                        e.target.nextSibling.style.display = 'flex'
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
