import { useState, useEffect } from 'react'
import { Ban, Play, Edit, Trash2, Plus } from 'lucide-react'
import DataTable from '../components/table/DataTable'
import Button from '../components/ui/Button'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import Modal from '../components/ui/Modal'
import OwnerForm from '../components/forms/OwnerForm'
import { formatCurrency, formatDate, formatPhone } from '../utils/formatters'
import { STATUS_COLORS } from '../utils/constants'
import toast from 'react-hot-toast'
import { ownerService } from '../services/ownerService'
import { subscriptionService } from '../services/subscriptionService'

export default function Owners() {
  const [owners, setOwners] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedOwner, setSelectedOwner] = useState(null)
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, owner: null })
  const [statusDialog, setStatusDialog] = useState({ isOpen: false, owner: null, status: null })
  
  useEffect(() => {
    fetchOwners()
  }, [])

  const fetchOwners = async () => {
    try {
      const data = await ownerService.getAll()
      setOwners(data.data || data)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch owners')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAdd = async (data) => {
    try {
      const { subscription_plan_id, payment_method, transaction_id, ...ownerData } = data
      
      const ownerResponse = await ownerService.create(ownerData)
      const ownerId = ownerResponse.data.data?.id || ownerResponse.data.id
      
      await subscriptionService.create({
        owner_id: ownerId,
        plan_id: subscription_plan_id,
        start_date: new Date().toISOString().split('T')[0],
        amount_paid: 0,
        payment_method,
        transaction_id
      })
      
      toast.success('Owner added successfully')
      setShowAddModal(false)
      fetchOwners()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add owner')
    }
  }

  const handleEdit = async (data) => {
    try {
      await ownerService.update(selectedOwner.id, data)
      toast.success('Owner updated successfully')
      setShowEditModal(false)
      setSelectedOwner(null)
      fetchOwners()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update owner')
    }
  }

  const handleDelete = async () => {
    try {
      await ownerService.delete(deleteDialog.owner.id)
      toast.success('Owner deleted successfully')
      setDeleteDialog({ isOpen: false, owner: null })
      fetchOwners()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete owner')
    }
  }

  const handleStatusChange = async () => {
    try {
      await ownerService.updateStatus(statusDialog.owner.id, statusDialog.status)
      toast.success('Owner status updated successfully')
      setStatusDialog({ isOpen: false, owner: null, status: null })
      fetchOwners()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update status')
    }
  }

  const getStatusBadge = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      suspended: 'bg-red-100 text-red-800',
    }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status]}`}>
        {status.toUpperCase()}
      </span>
    )
  }

  const columns = [
    { key: 'id', label: 'ID', sortable: true },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { 
      key: 'phone', 
      label: 'Phone',
      sortable: true,
      render: (row) => formatPhone(row.phone)
    },
    { 
      key: 'pan_number', 
      label: 'PAN',
      render: (row) => row.pan_number || 'N/A'
    },
    { 
      key: 'bank_name', 
      label: 'Bank',
      render: (row) => row.bank_name || 'N/A'
    },
    { 
      key: 'turfs_count', 
      label: 'Turfs', 
      sortable: true, 
      render: (row) => row.turfs_count || 0 
    },
    {
      key: 'subscription',
      label: 'Subscription',
      render: (row) => {
        if (row.active_subscription) {
          const sub = row.active_subscription
          return (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Active
            </span>
          )
        }
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Expired
          </span>
        )
      }
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => getStatusBadge(row.status)
    },
    {
      key: 'created_at',
      label: 'Joined',
      render: (row) => formatDate(row.created_at)
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex gap-1">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => {
              setSelectedOwner(row)
              setShowEditModal(true)
            }}
            title="Edit"
          >
            <Edit className="h-4 w-4" />
          </Button>
          
          {row.status === 'active' ? (
            <Button 
              size="sm" 
              variant="warning" 
              onClick={() => setStatusDialog({ isOpen: true, owner: row, status: 'suspended' })}
              title="Suspend"
            >
              <Ban className="h-4 w-4" />
            </Button>
          ) : row.status === 'suspended' ? (
            <Button 
              size="sm" 
              variant="success" 
              onClick={() => setStatusDialog({ isOpen: true, owner: row, status: 'active' })}
              title="Activate"
            >
              <Play className="h-4 w-4" />
            </Button>
          ) : null}
          
          <Button 
            size="sm" 
            variant="danger" 
            onClick={() => setDeleteDialog({ isOpen: true, owner: row })}
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Owner Management</h1>
          <p className="text-gray-600 mt-1">Manage turf owners and their accounts</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Owner
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Total Owners</p>
          <h3 className="text-2xl font-bold text-gray-900">{owners.length}</h3>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Active Owners</p>
          <h3 className="text-2xl font-bold text-green-600">
            {owners.filter(o => o.status === 'active').length}
          </h3>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Suspended Owners</p>
          <h3 className="text-2xl font-bold text-red-600">
            {owners.filter(o => o.status === 'suspended').length}
          </h3>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Total Turfs</p>
          <h3 className="text-2xl font-bold text-gray-900">
            {owners.reduce((sum, o) => sum + (o.turfs_count || 0), 0)}
          </h3>
        </div>
      </div>

      <DataTable columns={columns} data={owners} loading={isLoading} />

      {/* Add Owner Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Owner"
        size="lg"
      >
        <OwnerForm onSubmit={handleAdd} />
      </Modal>

      {/* Edit Owner Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setSelectedOwner(null)
        }}
        title="Edit Owner"
        size="lg"
      >
        <OwnerForm initialData={selectedOwner} onSubmit={handleEdit} />
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, owner: null })}
        onConfirm={handleDelete}
        title="Delete Owner"
        message={`Are you sure you want to delete ${deleteDialog.owner?.name}? This action cannot be undone.`}
        variant="danger"
      />

      {/* Status Change Confirmation */}
      <ConfirmDialog
        isOpen={statusDialog.isOpen}
        onClose={() => setStatusDialog({ isOpen: false, owner: null, status: null })}
        onConfirm={handleStatusChange}
        title={`${statusDialog.status === 'active' ? 'Activate' : 'Suspend'} Owner`}
        message={`Are you sure you want to ${statusDialog.status === 'active' ? 'activate' : 'suspend'} ${statusDialog.owner?.name}?`}
        variant={statusDialog.status === 'active' ? 'success' : 'warning'}
      />
    </div>
  )
}
