import { useState } from 'react'
import { Trash2, Eye, EyeOff, Star } from 'lucide-react'
import DataTable from '../components/table/DataTable'
import Button from '../components/ui/Button'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import Modal from '../components/ui/Modal'
import { useReviews, useUpdateReviewStatus, useDeleteReview } from '../api/hooks/useReviews'
import { formatDateTime } from '../utils/formatters'
import toast from 'react-hot-toast'

export default function Reviews() {
  const { data: reviews = [], isLoading } = useReviews()
  const [selectedReview, setSelectedReview] = useState(null)
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, review: null })
  
  const updateStatusMutation = useUpdateReviewStatus()
  const deleteMutation = useDeleteReview()

  const toggleStatus = (review) => {
    const newStatus = review.status === 'approved' ? 'hidden' : 'approved'
    updateStatusMutation.mutate(
      { reviewId: review.id, status: newStatus },
      {
        onSuccess: () => {
          toast.success(`Review ${newStatus === 'approved' ? 'approved' : 'hidden'} successfully`)
        },
        onError: (error) => {
          toast.error(error.response?.data?.message || 'Failed to update review status')
        }
      }
    )
  }

  const handleDelete = (review) => {
    setDeleteDialog({ isOpen: true, review })
  }

  const confirmDelete = () => {
    deleteMutation.mutate(deleteDialog.review.id, {
      onSuccess: () => {
        toast.success('Review deleted successfully')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to delete review')
      }
    })
    setDeleteDialog({ isOpen: false, review: null })
  }

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    )
  }

  const columns = [
    { key: 'id', label: 'ID', sortable: true },
    { 
      key: 'turf', 
      label: 'Turf',
      sortable: true,
      render: (row) => row.turf?.name || 'N/A'
    },
    { 
      key: 'player', 
      label: 'Player',
      sortable: true,
      render: (row) => row.player?.name || 'N/A'
    },
    { 
      key: 'rating', 
      label: 'Rating',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2">
          {renderStars(row.rating)}
          <span className="text-sm text-gray-600">({row.rating})</span>
        </div>
      )
    },
    { 
      key: 'comment', 
      label: 'Comment',
      render: (row) => (
        <div className="max-w-xs truncate" title={row.comment}>
          {row.comment || 'No comment'}
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          row.status === 'approved' ? 'bg-green-100 text-green-800' : 
          row.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
          'bg-gray-100 text-gray-800'
        }`}>
          {row.status}
        </span>
      )
    },
    {
      key: 'created_at',
      label: 'Date',
      render: (row) => formatDateTime(row.created_at)
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setSelectedReview(row)}>
            View
          </Button>
          <Button size="sm" variant="outline" onClick={() => toggleStatus(row)}>
            {row.status === 'approved' ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
          <Button size="sm" variant="danger" onClick={() => handleDelete(row)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ]

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Review Management</h1>
        <p className="text-gray-600 mt-1">Manage turf reviews and ratings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Total Reviews</p>
          <h3 className="text-2xl font-bold text-gray-900">{reviews.length}</h3>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Average Rating</p>
          <div className="flex items-center gap-2">
            <h3 className="text-2xl font-bold text-gray-900">{avgRating}</h3>
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Approved</p>
          <h3 className="text-2xl font-bold text-green-600">
            {reviews.filter(r => r.status === 'approved').length}
          </h3>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Pending</p>
          <h3 className="text-2xl font-bold text-yellow-600">
            {reviews.filter(r => r.status === 'pending').length}
          </h3>
        </div>
      </div>

      <DataTable columns={columns} data={reviews} loading={isLoading} />

      <Modal
        isOpen={!!selectedReview}
        onClose={() => setSelectedReview(null)}
        title="Review Details"
        size="lg"
      >
        {selectedReview && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Review ID</p>
                <p className="font-medium">{selectedReview.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  selectedReview.status === 'approved' ? 'bg-green-100 text-green-800' : 
                  selectedReview.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-gray-100 text-gray-800'
                }`}>
                  {selectedReview.status}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Turf</p>
                <p className="font-medium">{selectedReview.turf?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Player</p>
                <p className="font-medium">{selectedReview.player?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Rating</p>
                <div className="flex items-center gap-2">
                  {renderStars(selectedReview.rating)}
                  <span className="font-medium">({selectedReview.rating}/5)</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Date</p>
                <p className="font-medium">{formatDateTime(selectedReview.created_at)}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-600 mb-2">Comment</p>
                <p className="font-medium bg-gray-50 p-3 rounded-lg">
                  {selectedReview.comment || 'No comment provided'}
                </p>
              </div>
              {selectedReview.booking_id && (
                <div>
                  <p className="text-sm text-gray-600">Booking ID</p>
                  <p className="font-medium">{selectedReview.booking_id}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, review: null })}
        onConfirm={confirmDelete}
        title="Delete Review"
        message="Are you sure you want to delete this review? This action cannot be undone."
        variant="danger"
      />
    </div>
  )
}
