import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { reviewService } from '../../services/reviewService'

export const useReviews = (filters = {}) => {
  return useQuery({
    queryKey: ['reviews', filters],
    queryFn: async () => {
      const response = await reviewService.getAll(filters)
      return response.data
    }
  })
}

export const useUpdateReviewStatus = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, status }) => {
      const response = await reviewService.updateStatus(id, status)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['reviews'])
      toast.success('Review status updated')
    }
  })
}

export const useDeleteReview = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id) => {
      const response = await reviewService.delete(id)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['reviews'])
      toast.success('Review deleted successfully')
    }
  })
}
