import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { couponService } from '../../services/couponService'

export const useCoupons = (filters = {}) => {
  return useQuery({
    queryKey: ['coupons', filters],
    queryFn: async () => {
      const response = await couponService.getAll(filters)
      return response.data
    }
  })
}

export const useCreateCoupon = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data) => {
      const response = await couponService.create(data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['coupons'])
      toast.success('Coupon created successfully')
    }
  })
}

export const useUpdateCoupon = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await couponService.update(id, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['coupons'])
      toast.success('Coupon updated successfully')
    }
  })
}

export const useDeleteCoupon = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id) => {
      const response = await couponService.delete(id)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['coupons'])
      toast.success('Coupon deleted successfully')
    }
  })
}
