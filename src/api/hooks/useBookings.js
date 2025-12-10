import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { bookingService } from '../../services/bookingService'

export const useBookings = (filters = {}) => {
  return useQuery({
    queryKey: ['bookings', filters],
    queryFn: async () => {
      const response = await bookingService.getAll(filters)
      return response.data
    }
  })
}

export const useCancelBooking = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ bookingId, reason }) => {
      const response = await bookingService.cancel(bookingId, { reason })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['bookings'])
      toast.success('Booking cancelled')
    }
  })
}
