import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { playerService } from '../../services/playerService'

export const usePlayers = (filters = {}) => {
  return useQuery({
    queryKey: ['players', filters],
    queryFn: async () => {
      const response = await playerService.getAll(filters)
      // Handle paginated response
      return response.data?.data || response.data || []
    }
  })
}

export const usePlayer = (id) => {
  return useQuery({
    queryKey: ['player', id],
    queryFn: async () => {
      const response = await playerService.getById(id)
      return response.data
    },
    enabled: !!id
  })
}

export const useUpdatePlayerStatus = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ playerId, status }) => {
      const response = await playerService.updateStatus(playerId, status)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['players'])
      toast.success('Player status updated')
    }
  })
}
