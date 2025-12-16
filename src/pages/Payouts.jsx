import { useState, useEffect } from 'react'
import { CheckCircle, Eye, DollarSign, Plus } from 'lucide-react'
import DataTable from '../components/table/DataTable'
import Button from '../components/ui/Button'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import Modal from '../components/ui/Modal'
import { usePayouts, useReleasePayout, useProcessPayout, useGeneratePayout } from '../api/hooks/usePayouts'
import { ownerService } from '../services/ownerService'
import { formatCurrency, formatDate, formatDateTime } from '../utils/formatters'
import { STATUS_COLORS } from '../utils/constants'
import toast from 'react-hot-toast'

export default function Payouts() {
  const { data: payouts = [], isLoading, error } = usePayouts()
  
  console.log('Payouts data:', payouts)
  
  if (error) {
    console.error('Payouts error:', error)
  }
  const [selectedPayout, setSelectedPayout] = useState(null)
  const [releaseDialog, setReleaseDialog] = useState({ isOpen: false, payout: null })
  const [processDialog, setProcessDialog] = useState({ isOpen: false, payout: null })
  const [generateModal, setGenerateModal] = useState(false)
  const [owners, setOwners] = useState([])
  const [formData, setFormData] = useState({
    owner_id: '',
    period_start: '',
    period_end: ''
  })
  
  const releaseMutation = useReleasePayout()
  const processMutation = useProcessPayout()
  const generateMutation = useGeneratePayout()

  useEffect(() => {
    loadOwners()
  }, [])

  const loadOwners = async () => {
    try {
      const response = await ownerService.getAll()
      setOwners(response.data || [])
    } catch (error) {
      console.error('Failed to load owners:', error)
    }
  }

  const handleRelease = (payout) => {
    setReleaseDialog({ isOpen: true, payout })
  }

  const handleProcess = (payout) => {
    setProcessDialog({ isOpen: true, payout })
  }

  const confirmRelease = () => {
    releaseMutation.mutate(releaseDialog.payout.id, {
      onSuccess: () => toast.success('Payout released successfully'),
      onError: (error) => toast.error(error.response?.data?.message || 'Failed to release payout')
    })
    setReleaseDialog({ isOpen: false, payout: null })
  }

  const confirmProcess = () => {
    processMutation.mutate(processDialog.payout.id, {
      onSuccess: () => toast.success('Payout processed successfully'),
      onError: (error) => toast.error(error.response?.data?.message || 'Failed to process payout')
    })
    setProcessDialog({ isOpen: false, payout: null })
  }

  const handleGeneratePayout = (e) => {
    e.preventDefault()
    generateMutation.mutate(formData, {
      onSuccess: () => {
        toast.success('Payout generated successfully')
        setGenerateModal(false)
        setFormData({ owner_id: '', period_start: '', period_end: '' })
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to generate payout')
      }
    })
  }

  const columns = [
    { key: 'payout_number', label: 'Payout #', sortable: true },
    { 
      key: 'owner', 
      label: 'Owner', 
      sortable: true,
      render: (row) => row.owner?.name || 'N/A'
    },
    { 
      key: 'period', 
      label: 'Period',
      render: (row) => `${formatDate(row.period_start)} - ${formatDate(row.period_end)}`
    },
    { 
      key: 'total_bookings', 
      label: 'Bookings',
      sortable: true
    },
    { 
      key: 'total_revenue', 
      label: 'Revenue',
      sortable: true,
      render: (row) => formatCurrency(row.total_revenue)
    },
    { 
      key: 'commission_amount', 
      label: 'Commission (5%)',
      render: (row) => formatCurrency(row.commission_amount)
    },
    { 
      key: 'payout_amount', 
      label: 'Payout',
      sortable: true,
      render: (row) => formatCurrency(row.payout_amount)
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          row.status === 'paid' ? 'bg-green-100 text-green-800' :
          row.status === 'processed' ? 'bg-blue-100 text-blue-800' :
          'bg-yellow-100 text-yellow-800'
        }`}>
          {row.status || 'N/A'}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex gap-1">
          <Button size="sm" variant="outline" onClick={() => setSelectedPayout(row)} title="View">
            <Eye className="h-4 w-4" />
          </Button>
          {row.status === 'pending' && (
            <Button size="sm" variant="primary" onClick={() => handleProcess(row)} title="Process">
              <DollarSign className="h-4 w-4" />
            </Button>
          )}
          {row.status === 'processed' && (
            <Button size="sm" variant="success" onClick={() => handleRelease(row)} title="Release">
              <CheckCircle className="h-4 w-4" />
            </Button>
          )}
        </div>
      )
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payout Management</h1>
          <p className="text-gray-600 mt-1">Manage owner payouts and settlements</p>
        </div>
        <Button onClick={() => setGenerateModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Generate Payout
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Total Payouts</p>
          <h3 className="text-2xl font-bold text-gray-900">{payouts.length}</h3>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Pending</p>
          <h3 className="text-2xl font-bold text-yellow-600">
            {formatCurrency(payouts.filter(p => p.status === 'pending').reduce((sum, p) => sum + parseFloat(p.payout_amount || 0), 0))}
          </h3>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Processed</p>
          <h3 className="text-2xl font-bold text-blue-600">
            {formatCurrency(payouts.filter(p => p.status === 'processed').reduce((sum, p) => sum + parseFloat(p.payout_amount || 0), 0))}
          </h3>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Paid</p>
          <h3 className="text-2xl font-bold text-green-600">
            {formatCurrency(payouts.filter(p => p.status === 'paid').reduce((sum, p) => sum + parseFloat(p.payout_amount || 0), 0))}
          </h3>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Commission</p>
          <h3 className="text-2xl font-bold text-gray-900">
            {formatCurrency(payouts.reduce((sum, p) => sum + parseFloat(p.commission_amount || 0), 0))}
          </h3>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">Failed to load payouts. Please try again.</p>
        </div>
      )}
      
      {!isLoading && payouts.length === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
          <p className="text-blue-800 text-lg font-medium mb-2">No payouts generated yet</p>
          <p className="text-blue-600">Payouts need to be manually generated for owners with completed bookings.</p>
          <p className="text-blue-600 text-sm mt-2">Use the API endpoint: POST /admin/payouts/generate</p>
        </div>
      )}
      
      <DataTable columns={columns} data={payouts} loading={isLoading} />

      <ConfirmDialog
        isOpen={processDialog.isOpen}
        onClose={() => setProcessDialog({ isOpen: false, payout: null })}
        onConfirm={confirmProcess}
        title="Process Payout"
        message={`Process payout of ${processDialog.payout ? formatCurrency(processDialog.payout.payout_amount) : ''} for ${processDialog.payout?.owner?.name}?`}
        variant="primary"
        confirmText="Process"
      />

      <ConfirmDialog
        isOpen={releaseDialog.isOpen}
        onClose={() => setReleaseDialog({ isOpen: false, payout: null })}
        onConfirm={confirmRelease}
        title="Release Payout"
        message={`Release payout of ${releaseDialog.payout ? formatCurrency(releaseDialog.payout.payout_amount) : ''} to ${releaseDialog.payout?.owner?.name}?`}
        variant="success"
        confirmText="Release"
      />

      <Modal isOpen={generateModal} onClose={() => setGenerateModal(false)} title="Generate Payout" size="md">
        <form onSubmit={handleGeneratePayout} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Owner</label>
            <select
              value={formData.owner_id}
              onChange={(e) => setFormData({ ...formData, owner_id: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select Owner</option>
              {owners.map(owner => (
                <option key={owner.id} value={owner.id}>{owner.name} - {owner.phone}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Period Start</label>
            <input
              type="date"
              value={formData.period_start}
              onChange={(e) => setFormData({ ...formData, period_start: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Period End</label>
            <input
              type="date"
              value={formData.period_end}
              onChange={(e) => setFormData({ ...formData, period_end: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={() => setGenerateModal(false)}>Cancel</Button>
            <Button type="submit" disabled={generateMutation.isPending}>
              {generateMutation.isPending ? 'Generating...' : 'Generate'}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!selectedPayout} onClose={() => setSelectedPayout(null)} title="Payout Details" size="lg">
        {selectedPayout && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-sm text-gray-600">Payout Number</p><p className="font-medium">{selectedPayout.payout_number}</p></div>
              <div><p className="text-sm text-gray-600">Status</p><span className={`px-2 py-1 rounded-full text-xs font-medium ${selectedPayout.status === 'paid' ? 'bg-green-100 text-green-800' : selectedPayout.status === 'processed' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>{selectedPayout.status}</span></div>
              <div><p className="text-sm text-gray-600">Owner</p><p className="font-medium">{selectedPayout.owner?.name || 'N/A'}</p></div>
              <div><p className="text-sm text-gray-600">Owner Phone</p><p className="font-medium">{selectedPayout.owner?.phone || 'N/A'}</p></div>
              <div><p className="text-sm text-gray-600">Period Start</p><p className="font-medium">{formatDate(selectedPayout.period_start)}</p></div>
              <div><p className="text-sm text-gray-600">Period End</p><p className="font-medium">{formatDate(selectedPayout.period_end)}</p></div>
              <div><p className="text-sm text-gray-600">Total Bookings</p><p className="font-medium">{selectedPayout.total_bookings}</p></div>
              <div><p className="text-sm text-gray-600">Total Revenue</p><p className="font-medium">{formatCurrency(selectedPayout.total_revenue)}</p></div>
              <div><p className="text-sm text-gray-600">Commission</p><p className="font-medium text-red-600">{formatCurrency(selectedPayout.commission_amount)}</p></div>
              <div><p className="text-sm text-gray-600">Payout Amount</p><p className="font-medium text-green-600 text-lg">{formatCurrency(selectedPayout.payout_amount)}</p></div>
              {selectedPayout.processed_at && <div><p className="text-sm text-gray-600">Processed At</p><p className="font-medium">{formatDateTime(selectedPayout.processed_at)}</p></div>}
              {selectedPayout.paid_date && <div><p className="text-sm text-gray-600">Paid Date</p><p className="font-medium">{formatDate(selectedPayout.paid_date)}</p></div>}
            </div>
            {selectedPayout.owner && (
              <div className="border-t pt-4"><p className="text-sm text-gray-600 mb-2">Bank Details</p>
                <div className="grid grid-cols-2 gap-4">
                  <div><p className="text-sm text-gray-600">Bank Name</p><p className="font-medium">{selectedPayout.owner.bank_name || 'N/A'}</p></div>
                  <div><p className="text-sm text-gray-600">Account Holder</p><p className="font-medium">{selectedPayout.owner.account_holder_name || 'N/A'}</p></div>
                  <div><p className="text-sm text-gray-600">Account Number</p><p className="font-medium">{selectedPayout.owner.account_number || 'N/A'}</p></div>
                  <div><p className="text-sm text-gray-600">IFSC Code</p><p className="font-medium">{selectedPayout.owner.ifsc_code || 'N/A'}</p></div>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
