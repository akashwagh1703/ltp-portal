import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { turfService } from '../../services/turfService'

export const useTurfs = (filters = {}) => {
  return useQuery({
    queryKey: ['turfs', filters],
    queryFn: async () => {
      const response = await turfService.getAll(filters)
      return response.data
    }
  })
}

export const useApproveTurf = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (turfId) => {
      const response = await turfService.approve(turfId)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['turfs'])
      toast.success('Turf approved. It can now take bookings.')
    },
    onError: (error) => {
      toast.error(error.response?.data?.error?.message || error.response?.data?.message || 'Cannot approve turf')
    }
  })
}

export const useRejectTurf = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ turfId, reason }) => {
      const response = await turfService.reject(turfId, { reason })
      return response.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['turfs'])
      toast.success(data?.message || 'Told the owner. They can fix it and submit again.')
    }
  })
}

export const useSuspendTurf = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ turfId, reason }) => {
      const response = await turfService.suspend(turfId, { reason })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['turfs'])
      toast.success('Turf suspended')
    }
  })
}

export const useActivateTurf = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (turfId) => {
      const response = await turfService.activate(turfId)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['turfs'])
      toast.success('Turf activated')
    },
    onError: (error) => {
      toast.error(error.response?.data?.error?.message || error.response?.data?.message || 'Cannot activate turf')
    }
  })
}

export const useDeleteTurf = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (turfId) => {
      const response = await turfService.delete(turfId)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['turfs'])
      toast.success('Turf deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete turf')
    }
  })
}

export const useToggleFeatured = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (turfId) => {
      const response = await turfService.toggleFeatured(turfId)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['turfs'])
      toast.success('Featured status updated')
    },
    onError: () => {
      toast.error('Failed to update featured status')
    }
  })
}
