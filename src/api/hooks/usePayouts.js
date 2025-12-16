import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { payoutService } from '../../services/payoutService'

export const usePayouts = (filters = {}) => {
  return useQuery({
    queryKey: ['payouts', filters],
    queryFn: async () => {
      const response = await payoutService.getAll(filters)
      return Array.isArray(response.data) ? response.data : (response.data?.data || [])
    }
  })
}

export const useProcessPayout = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (payoutId) => {
      const response = await payoutService.process(payoutId)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['payouts'])
      toast.success('Payout processed successfully')
    }
  })
}

export const useReleasePayout = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (payoutId) => {
      const response = await payoutService.release(payoutId)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['payouts'])
      toast.success('Payout released successfully')
    }
  })
}

export const useGeneratePayout = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data) => {
      const response = await payoutService.generate(data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['payouts'])
      toast.success('Payout generated successfully')
    }
  })
}
