import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { settingService } from '../../services/settingService'

export const useSettings = () => {
  return useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const response = await settingService.getAll()
      return response.data
    }
  })
}

export const useUpdateSetting = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ key, value }) => {
      const response = await settingService.update(key, { value })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['settings'])
      toast.success('Setting updated successfully')
    }
  })
}
