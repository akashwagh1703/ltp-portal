import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { ownerService } from '../../services/ownerService'

export const useOwners = (filters = {}) => {
  return useQuery({
    queryKey: ['owners', filters],
    queryFn: async () => {
      const response = await ownerService.getAll(filters)
      return response.data
    }
  })
}

export const useOwner = (id) => {
  return useQuery({
    queryKey: ['owner', id],
    queryFn: async () => {
      const response = await ownerService.getById(id)
      return response.data
    },
    enabled: !!id
  })
}

export const useCreateOwner = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data) => {
      const response = await ownerService.create(data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['owners'])
      toast.success('Owner created successfully')
    }
  })
}

export const useUpdateOwner = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await ownerService.update(id, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['owners'])
      toast.success('Owner updated successfully')
    }
  })
}

export const useDeleteOwner = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id) => {
      const response = await ownerService.delete(id)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['owners'])
      toast.success('Owner deleted successfully')
    }
  })
}
