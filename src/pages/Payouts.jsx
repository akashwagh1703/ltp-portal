import { useState, useEffect } from 'react'
import { CheckCircle, Eye, DollarSign, Plus, Zap, Calendar, Filter, X } from 'lucide-react'
import DataTable from '../components/table/DataTable'
import Button from '../components/ui/Button'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import Modal from '../components/ui/Modal'
import PayoutSummaryCard from '../components/cards/PayoutSummaryCard'
import { usePayouts, useReleasePayout, useProcessPayout, useGeneratePayout, useGenerateBulkPayout } from '../api/hooks/usePayouts'
import { ownerService } from '../services/ownerService'
import { formatCurrency, formatDate, formatDateTime } from '../utils/formatters'
import { STATUS_COLORS } from '../utils/constants'
import toast from 'react-hot-toast'

export default function Payouts() {
  const [filters, setFilters] = useState({
    owner_id: '',
    status: '',
    period_start: '',
    period_end: '',
    payment_method: ''
  })
  const [showFilters, setShowFilters] = useState(false)
  const { data: payouts = [], isLoading, error } = usePayouts(filters)
  
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
  const [quickGenerate, setQuickGenerate] = useState(false)
  
  const releaseMutation = useReleasePayout()
  const processMutation = useProcessPayout()
  const generateMutation = useGeneratePayout()
  const generateBulkMutation = useGenerateBulkPayout()

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

  const getSmartDefaults = () => {
    const today = new Date()
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1)
    const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0)
    
    return {
      period_start: lastMonth.toISOString().split('T')[0],
      period_end: lastMonthEnd.toISOString().split('T')[0]
    }
  }

  const handleQuickGenerate = (ownerId) => {
    const defaults = getSmartDefaults()
    setFormData({
      owner_id: ownerId,
      ...defaults
    })
    setGenerateModal(true)
  }

  const handleBulkGenerate = () => {
    const defaults = getSmartDefaults()
    generateBulkMutation.mutate(defaults, {
      onSuccess: () => {
        setQuickGenerate(false)
        toast.success('Bulk payouts generated successfully')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to generate bulk payouts')
      }
    })
  }

  const clearFilters = () => {
    setFilters({
      owner_id: '',
      status: '',
      period_start: '',
      period_end: '',
      payment_method: ''
    })
  }

  const hasActiveFilters = Object.values(filters).some(value => value !== '')

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

  const handleQuickRelease = (payout) => {
    releaseMutation.mutate(payout.id, {
      onSuccess: () => toast.success('Payout released successfully'),
      onError: (error) => toast.error(error.response?.data?.message || 'Failed to release payout')
    })
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
          <Button size="sm" variant="outline" onClick={() => setSelectedPayout(row)} icon={<Eye className="h-4 w-4" />} title="View" />
          {row.status === 'pending' && (
            <Button size="sm" variant="primary" onClick={() => handleProcess(row)} icon={<Zap className="h-4 w-4" />} title="Process" />
          )}
          {row.status === 'processed' && (
            <Button size="sm" variant="success" onClick={() => handleQuickRelease(row)} icon={<CheckCircle className="h-4 w-4" />} title="Release" />
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
        <div className="flex gap-2">
          <Button 
            variant={hasActiveFilters ? "primary" : "outline"} 
            onClick={() => setShowFilters(!showFilters)}
            icon={<Filter className="h-4 w-4" />}
          >
            Filters {hasActiveFilters && `(${Object.values(filters).filter(v => v).length})`}
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setQuickGenerate(true)}
            icon={<Zap className="h-4 w-4" />}
          >
            Quick Generate
          </Button>
          <Button 
            onClick={() => setGenerateModal(true)}
            icon={<Plus className="h-4 w-4" />}
          >
            Custom Payout
          </Button>
        </div>
      </div>

      {showFilters && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Filter Payouts</h3>
            <Button size="sm" variant="outline" onClick={() => setShowFilters(false)} icon={<X className="h-4 w-4" />} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Owner</label>
              <select
                value={filters.owner_id}
                onChange={(e) => setFilters({...filters, owner_id: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Owners</option>
                {owners.map(owner => (
                  <option key={owner.id} value={owner.id}>{owner.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="processed">Processed</option>
                <option value="processing">Processing</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
              <select
                value={filters.payment_method}
                onChange={(e) => setFilters({...filters, payment_method: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Methods</option>
                <option value="razorpay">Razorpay</option>
                <option value="manual">Manual</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Period Start</label>
              <input
                type="date"
                value={filters.period_start}
                onChange={(e) => setFilters({...filters, period_start: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Period End</label>
              <input
                type="date"
                value={filters.period_end}
                onChange={(e) => setFilters({...filters, period_end: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4 mb-4">
            <Button size="sm" variant="ghost" onClick={() => setFilters({...filters, status: 'pending'})}>
              Pending Only
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setFilters({...filters, status: 'processing'})}>
              Processing
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setFilters({...filters, status: 'paid'})}>
              Completed
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setFilters({...filters, payment_method: 'razorpay'})}>
              Razorpay Only
            </Button>
          </div>
          
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={clearFilters} disabled={!hasActiveFilters}>
              Clear All
            </Button>
            <div className="text-sm text-gray-500 flex items-center">
              Showing {payouts.length} payout{payouts.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      )}

      <PayoutSummaryCard payouts={payouts} />

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-800">Failed to load payouts. Please try again.</p>
        </div>
      )}
      
      {!isLoading && payouts.length === 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-8 text-center">
          <div className="max-w-md mx-auto">
            <DollarSign className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <p className="text-blue-800 text-lg font-medium mb-2">No payouts generated yet</p>
            <p className="text-blue-600 mb-4">Use Quick Generate to create payouts for all owners with last month's data.</p>
            <Button 
              onClick={() => setQuickGenerate(true)}
              className="mx-auto"
              icon={<Zap className="h-4 w-4" />}
            >
              Quick Generate
            </Button>
          </div>
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
        confirmText="Release Payment"
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
          <div className="grid grid-cols-2 gap-4">
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
          </div>
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-700">
              <Calendar className="h-4 w-4 inline mr-1" />
              Smart Default: Last month ({formatDate(getSmartDefaults().period_start)} - {formatDate(getSmartDefaults().period_end)})
            </p>
            <Button 
              type="button" 
              size="sm" 
              variant="outline" 
              className="mt-2"
              onClick={() => setFormData({ ...formData, ...getSmartDefaults() })}
            >
              Use Smart Default
            </Button>
          </div>
          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={() => setGenerateModal(false)}>Cancel</Button>
            <Button type="submit" disabled={generateMutation.isPending}>
              {generateMutation.isPending ? 'Generating...' : 'Generate'}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={quickGenerate} onClose={() => setQuickGenerate(false)} title="Quick Generate - Last Month" size="md">
        <div className="space-y-4">
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-medium text-green-800 mb-2">Generate payouts for last month</h3>
            <p className="text-sm text-green-700 mb-3">
              Period: {formatDate(getSmartDefaults().period_start)} - {formatDate(getSmartDefaults().period_end)}
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button 
              className="flex-1" 
              onClick={handleBulkGenerate}
              disabled={generateBulkMutation.isPending}
              loading={generateBulkMutation.isPending}
              icon={<Zap className="h-4 w-4" />}
            >
              Generate All Owners
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                setQuickGenerate(false)
                navigate('/notifications')
              }}
            >
              Send Notification
            </Button>
          </div>
          
          <div className="space-y-2 max-h-60 overflow-y-auto border-t pt-4">
            <p className="text-sm text-gray-600 mb-2">Or generate for individual owners:</p>
            {owners.map(owner => (
              <div key={owner.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{owner.name}</p>
                  <p className="text-sm text-gray-600">{owner.phone}</p>
                </div>
                <Button 
                  size="sm" 
                  onClick={() => {
                    handleQuickGenerate(owner.id)
                    setQuickGenerate(false)
                  }}
                >
                  Generate
                </Button>
              </div>
            ))}
          </div>
          
          <div className="flex gap-2 justify-end pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setQuickGenerate(false)}>Cancel</Button>
          </div>
        </div>
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
