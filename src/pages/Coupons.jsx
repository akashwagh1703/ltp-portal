import { useState } from 'react'
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react'
import DataTable from '../components/table/DataTable'
import Button from '../components/ui/Button'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import Modal from '../components/ui/Modal'
import Input from '../components/ui/Input'
import Select from '../components/ui/Select'
import { useCoupons, useCreateCoupon, useUpdateCoupon, useDeleteCoupon } from '../api/hooks/useCoupons'
import { formatCurrency, formatDate } from '../utils/formatters'
import toast from 'react-hot-toast'
import { useForm } from 'react-hook-form'

export default function Coupons() {
  const { data: coupons = [], isLoading } = useCoupons()
  const [showModal, setShowModal] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState(null)
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, coupon: null })
  
  const createMutation = useCreateCoupon()
  const updateMutation = useUpdateCoupon()
  const deleteMutation = useDeleteCoupon()

  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm()

  const discountType = watch('discount_type')

  const openCreateModal = () => {
    setEditingCoupon(null)
    reset({
      code: '',
      description: '',
      discount_type: 'percentage',
      discount_value: '',
      max_discount: '',
      min_booking_amount: '',
      usage_limit: '',
      valid_from: '',
      valid_until: '',
      is_active: true
    })
    setShowModal(true)
  }

  const openEditModal = (coupon) => {
    setEditingCoupon(coupon)
    reset({
      code: coupon.code,
      description: coupon.description || '',
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      max_discount: coupon.max_discount || '',
      min_booking_amount: coupon.min_booking_amount || '',
      usage_limit: coupon.usage_limit || '',
      valid_from: coupon.valid_from,
      valid_until: coupon.valid_until,
      is_active: coupon.is_active
    })
    setShowModal(true)
  }

  const onSubmit = (data) => {
    const mutation = editingCoupon ? updateMutation : createMutation
    const payload = {
      ...data,
      code: data.code.toUpperCase(),
      discount_value: parseFloat(data.discount_value),
      max_discount: data.max_discount ? parseFloat(data.max_discount) : null,
      min_booking_amount: data.min_booking_amount ? parseFloat(data.min_booking_amount) : null,
      usage_limit: data.usage_limit ? parseInt(data.usage_limit) : null,
    }

    mutation.mutate(
      editingCoupon ? { id: editingCoupon.id, data: payload } : payload,
      {
        onSuccess: () => {
          toast.success(`Coupon ${editingCoupon ? 'updated' : 'created'} successfully`)
          setShowModal(false)
          reset()
        },
        onError: (error) => {
          toast.error(error.response?.data?.message || `Failed to ${editingCoupon ? 'update' : 'create'} coupon`)
        }
      }
    )
  }

  const handleDelete = (coupon) => {
    setDeleteDialog({ isOpen: true, coupon })
  }

  const confirmDelete = () => {
    deleteMutation.mutate(deleteDialog.coupon.id, {
      onSuccess: () => {
        toast.success('Coupon deleted successfully')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to delete coupon')
      }
    })
    setDeleteDialog({ isOpen: false, coupon: null })
  }

  const toggleStatus = (coupon) => {
    updateMutation.mutate(
      { id: coupon.id, data: { is_active: !coupon.is_active } },
      {
        onSuccess: () => {
          toast.success(`Coupon ${!coupon.is_active ? 'activated' : 'deactivated'} successfully`)
        },
        onError: (error) => {
          toast.error(error.response?.data?.message || 'Failed to update coupon status')
        }
      }
    )
  }

  const columns = [
    { key: 'code', label: 'Code', sortable: true },
    { key: 'description', label: 'Description', render: (row) => row.description || 'N/A' },
    { 
      key: 'discount', 
      label: 'Discount',
      render: (row) => row.discount_type === 'percentage' 
        ? `${row.discount_value}%` 
        : formatCurrency(row.discount_value)
    },
    { 
      key: 'min_amount', 
      label: 'Min Amount',
      render: (row) => row.min_booking_amount ? formatCurrency(row.min_booking_amount) : 'N/A'
    },
    { 
      key: 'usage', 
      label: 'Usage',
      render: (row) => `${row.used_count || 0}${row.usage_limit ? `/${row.usage_limit}` : ''}`
    },
    { 
      key: 'valid_from', 
      label: 'Valid From',
      render: (row) => formatDate(row.valid_from)
    },
    { 
      key: 'valid_until', 
      label: 'Valid Until',
      render: (row) => formatDate(row.valid_until)
    },
    {
      key: 'is_active',
      label: 'Status',
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${row.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
          {row.is_active ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => toggleStatus(row)}>
            {row.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
          <Button size="sm" variant="outline" onClick={() => openEditModal(row)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="danger" onClick={() => handleDelete(row)}>
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
          <h1 className="text-3xl font-bold text-gray-900">Coupon Management</h1>
          <p className="text-gray-600 mt-1">Create and manage discount coupons</p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="h-4 w-4 mr-2" />
          Add Coupon
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Total Coupons</p>
          <h3 className="text-2xl font-bold text-gray-900">{coupons.length}</h3>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Active Coupons</p>
          <h3 className="text-2xl font-bold text-green-600">
            {coupons.filter(c => c.is_active).length}
          </h3>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-600 mb-1">Total Usage</p>
          <h3 className="text-2xl font-bold text-gray-900">
            {coupons.reduce((sum, c) => sum + (c.used_count || 0), 0)}
          </h3>
        </div>
      </div>

      <DataTable columns={columns} data={coupons} loading={isLoading} />

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingCoupon ? 'Edit Coupon' : 'Create Coupon'}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Coupon Code"
            placeholder="SUMMER2024"
            error={errors.code?.message}
            {...register('code', { 
              required: 'Code is required',
              pattern: {
                value: /^[A-Z0-9]+$/,
                message: 'Only uppercase letters and numbers allowed'
              }
            })}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              className="w-full p-3 border rounded-lg"
              rows="2"
              placeholder="Enter coupon description"
              {...register('description')}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Discount Type"
              error={errors.discount_type?.message}
              {...register('discount_type', { required: 'Discount type is required' })}
            >
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed Amount</option>
            </Select>

            <Input
              label="Discount Value"
              type="number"
              step="0.01"
              placeholder={discountType === 'percentage' ? '10' : '100'}
              error={errors.discount_value?.message}
              {...register('discount_value', { 
                required: 'Discount value is required',
                min: { value: 0, message: 'Must be positive' }
              })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Max Discount (Optional)"
              type="number"
              step="0.01"
              placeholder="500"
              {...register('max_discount')}
            />

            <Input
              label="Min Booking Amount (Optional)"
              type="number"
              step="0.01"
              placeholder="1000"
              {...register('min_booking_amount')}
            />
          </div>

          <Input
            label="Usage Limit (Optional)"
            type="number"
            placeholder="100"
            {...register('usage_limit')}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Valid From"
              type="date"
              error={errors.valid_from?.message}
              {...register('valid_from', { required: 'Valid from date is required' })}
            />

            <Input
              label="Valid Until"
              type="date"
              error={errors.valid_until?.message}
              {...register('valid_until', { required: 'Valid until date is required' })}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              className="rounded"
              {...register('is_active')}
            />
            <label htmlFor="is_active" className="text-sm text-gray-700">Active</label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1" loading={createMutation.isPending || updateMutation.isPending}>
              {editingCoupon ? 'Update' : 'Create'} Coupon
            </Button>
            <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, coupon: null })}
        onConfirm={confirmDelete}
        title="Delete Coupon"
        message={`Are you sure you want to delete coupon "${deleteDialog.coupon?.code}"? This action cannot be undone.`}
        variant="danger"
      />
    </div>
  )
}
