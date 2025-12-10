import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { turfUpdateRequestService } from '../../services/turfUpdateRequestService'

export const useTurfUpdateRequests = (filters = {}) => {
  return useQuery({
    queryKey: ['turfUpdateRequests', filters],
    queryFn: async () => {
      const response = await turfUpdateRequestService.getAll(filters)
      return response.data
    }
  })
}

export const useApproveUpdateRequest = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (requestId) => {
      const response = await turfUpdateRequestService.approve(requestId)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['turfUpdateRequests'])
      toast.success('Update request approved')
    }
  })
}

export const useRejectUpdateRequest = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ requestId, reason }) => {
      const response = await turfUpdateRequestService.reject(requestId, { reason })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['turfUpdateRequests'])
      toast.success('Update request rejected')
    }
  })
}
