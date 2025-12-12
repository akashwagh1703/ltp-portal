import { useQuery } from '@tanstack/react-query'
import { reportService } from '../../services/reportService'

export const useReports = (reportType, dateFrom, dateTo) => {
  return useQuery({
    queryKey: ['reports', reportType, dateFrom, dateTo],
    queryFn: async () => {
      const params = { date_from: dateFrom, date_to: dateTo }
      let response
      
      switch(reportType) {
        case 'bookings':
          response = await reportService.getBookings(params)
          break
        case 'turf-wise':
          response = await reportService.getTurfWise(params)
          break
        case 'owner-wise':
          response = await reportService.getOwnerWise(params)
          break
        case 'payment-mode':
          response = await reportService.getPaymentMode(params)
          break
        default:
          response = await reportService.getBookings(params)
      }
      
      return response.data
    },
    enabled: !!dateFrom && !!dateTo
  })
}

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
