import { useQuery } from '@tanstack/react-query'
import { reportService } from '../../services/reportService'

export const useBookingReport = (params = {}) => {
  return useQuery({
    queryKey: ['reports', 'bookings', params],
    queryFn: async () => {
      const response = await reportService.getBookings(params)
      return response.data
    }
  })
}

export const useTurfWiseReport = (params = {}) => {
  return useQuery({
    queryKey: ['reports', 'turf-wise', params],
    queryFn: async () => {
      const response = await reportService.getTurfWise(params)
      return response.data
    }
  })
}

export const useOwnerWiseReport = (params = {}) => {
  return useQuery({
    queryKey: ['reports', 'owner-wise', params],
    queryFn: async () => {
      const response = await reportService.getOwnerWise(params)
      return response.data
    }
  })
}

export const usePaymentModeReport = (params = {}) => {
  return useQuery({
    queryKey: ['reports', 'payment-mode', params],
    queryFn: async () => {
      const response = await reportService.getPaymentMode(params)
      return response.data
    }
  })
}
