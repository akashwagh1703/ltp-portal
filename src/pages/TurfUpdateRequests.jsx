import { useState } from 'react'
import { CheckCircle, XCircle } from 'lucide-react'
import DataTable from '../components/table/DataTable'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import { useTurfUpdateRequests, useApproveUpdateRequest, useRejectUpdateRequest } from '../api/hooks/useTurfUpdateRequests'
import { formatDateTime } from '../utils/formatters'

export default function TurfUpdateRequests() {
  const { data: requests = [], isLoading } = useTurfUpdateRequests()
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [actionDialog, setActionDialog] = useState({ isOpen: false, type: null, request: null })
  
  const approveMutation = useApproveUpdateRequest()
  const rejectMutation = useRejectUpdateRequest()

  const handleAction = (type, request) => {
    setActionDialog({ isOpen: true, type, request })
  }

  const confirmAction = () => {
    const { type, request } = actionDialog
    
    if (type === 'approve') {
      approveMutation.mutate(request.request_id)
    } else if (type === 'reject') {
      rejectMutation.mutate({ requestId: request.request_id, reason: 'Does not meet requirements' })
    }
    
    setActionDialog({ isOpen: false, type: null, request: null })
  }

  const columns = [
    { key: 'request_id', label: 'ID', sortable: true },
    { key: 'turf_name', label: 'Turf', sortable: true },
    { key: 'owner_name', label: 'Owner', sortable: true },
    {
      key: 'requested_at',
      label: 'Requested At',
      sortable: true,
      render: (row) => formatDateTime(row.requested_at)
    },
    {
      key: 'changes',
      label: 'Changes',
      render: (row) => Object.keys(row.changes).length + ' field(s)'
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setSelectedRequest(row)}>
            Review
          </Button>
          <Button size="sm" variant="success" onClick={() => handleAction('approve', row)}>
            <CheckCircle className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="danger" onClick={() => handleAction('reject', row)}>
            <XCircle className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Turf Update Requests</h1>
        <p className="text-gray-600 mt-1">Review and approve turf update requests</p>
      </div>

      <DataTable columns={columns} data={requests} loading={isLoading} />

      <Modal
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        title="Review Update Request"
        size="lg"
      >
        {selectedRequest && (
          <div className="space-y-6">
            <div>
              <p className="text-sm text-gray-600">Turf</p>
              <p className="font-medium text-lg">{selectedRequest.turf_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Owner</p>
              <p className="font-medium">{selectedRequest.owner_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-3">Requested Changes</p>
              <div className="space-y-4">
                {Object.entries(selectedRequest.changes).map(([field, values]) => (
                  <div key={field} className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-700 mb-2 capitalize">
                      {field.replace(/_/g, ' ')}
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Old Value</p>
                        <p className="text-sm font-medium text-red-600">{values.old}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">New Value</p>
                        <p className="text-sm font-medium text-green-600">{values.new}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                variant="success"
                onClick={() => {
                  handleAction('approve', selectedRequest)
                  setSelectedRequest(null)
                }}
                className="flex-1"
              >
                Approve Changes
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  handleAction('reject', selectedRequest)
                  setSelectedRequest(null)
                }}
                className="flex-1"
              >
                Reject Changes
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={actionDialog.isOpen}
        onClose={() => setActionDialog({ isOpen: false, type: null, request: null })}
        onConfirm={confirmAction}
        title={`${actionDialog.type?.charAt(0).toUpperCase() + actionDialog.type?.slice(1)} Update Request`}
        message={`Are you sure you want to ${actionDialog.type} this update request?`}
        variant={actionDialog.type === 'approve' ? 'success' : 'danger'}
      />
    </div>
  )
}
