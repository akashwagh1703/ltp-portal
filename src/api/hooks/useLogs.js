import { useQuery } from '@tanstack/react-query'
import { logService } from '../../services/logService'

export const useActivityLogs = (params = {}) => {
  return useQuery({
    queryKey: ['logs', 'activity', params],
    queryFn: async () => {
      const response = await logService.getActivityLogs(params)
      return response.data
    }
  })
}
