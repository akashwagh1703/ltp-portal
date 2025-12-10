import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { cmsService } from '../../services/cmsService'

export const useBanners = () => {
  return useQuery({
    queryKey: ['banners'],
    queryFn: async () => {
      const response = await cmsService.getBanners()
      return response.data
    }
  })
}

export const useCreateBanner = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data) => {
      const response = await cmsService.createBanner(data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['banners'])
      toast.success('Banner created successfully')
    }
  })
}

export const useUpdateBanner = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await cmsService.updateBanner(id, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['banners'])
      toast.success('Banner updated successfully')
    }
  })
}

export const useDeleteBanner = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id) => {
      const response = await cmsService.deleteBanner(id)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['banners'])
      toast.success('Banner deleted successfully')
    }
  })
}

export const useFaqs = () => {
  return useQuery({
    queryKey: ['faqs'],
    queryFn: async () => {
      const response = await cmsService.getFaqs()
      return response.data
    }
  })
}

export const useCreateFaq = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data) => {
      const response = await cmsService.createFaq(data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['faqs'])
      toast.success('FAQ created successfully')
    }
  })
}

export const useUpdateFaq = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await cmsService.updateFaq(id, data)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['faqs'])
      toast.success('FAQ updated successfully')
    }
  })
}

export const useDeleteFaq = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id) => {
      const response = await cmsService.deleteFaq(id)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['faqs'])
      toast.success('FAQ deleted successfully')
    }
  })
}
