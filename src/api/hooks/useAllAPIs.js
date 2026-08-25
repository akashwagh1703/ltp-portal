import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiService from '../apiService'
import toast from 'react-hot-toast'

// Authentication hooks
export const useLogin = () => {
  return useMutation({
    mutationFn: apiService.auth.login,
    onSuccess: (data) => {
      localStorage.setItem('admin_token', data.token)
      localStorage.setItem('admin_user', JSON.stringify(data.admin || data.user))
      toast.success('Login successful')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Login failed')
    }
  })
}

export const useLogout = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: apiService.auth.logout,
    onSuccess: () => {
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_user')
      queryClient.clear()
      toast.success('Logged out successfully')
    }
  })
}

// Dashboard hooks
export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => apiService.dashboard.getStats().then(res => res.data)
  })
}

export const useRecentBookings = () => {
  return useQuery({
    queryKey: ['dashboard', 'recent-bookings'],
    queryFn: () => apiService.dashboard.getRecentBookings().then(res => res.data)
  })
}

// Turfs hooks
export const useTurfs = (params = {}) => {
  return useQuery({
    queryKey: ['turfs', params],
    queryFn: () => apiService.turfs.list(params).then(res => res.data)
  })
}

export const useTurf = (id) => {
  return useQuery({
    queryKey: ['turfs', id],
    queryFn: () => apiService.turfs.detail(id).then(res => res.data),
    enabled: !!id
  })
}

export const useCreateTurf = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: apiService.turfs.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['turfs'] })
      toast.success('Turf created successfully')
    }
  })
}

export const useUpdateTurf = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => apiService.turfs.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['turfs'] })
      toast.success('Turf updated successfully')
    }
  })
}

export const useApproveTurf = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: apiService.turfs.approve,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['turfs'] })
      toast.success('Turf approved successfully')
    },
    onError: (error) => {
      toast.error(error.response?.data?.error?.message || error.response?.data?.message || 'Cannot approve turf')
    }
  })
}

export const useRejectTurf = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: apiService.turfs.reject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['turfs'] })
      toast.success('Turf rejected successfully')
    }
  })
}

// Owners hooks
export const useOwners = (params = {}) => {
  return useQuery({
    queryKey: ['owners', params],
    queryFn: () => apiService.owners.list(params).then(res => res.data)
  })
}

export const useOwner = (id) => {
  return useQuery({
    queryKey: ['owners', id],
    queryFn: () => apiService.owners.detail(id).then(res => res.data),
    enabled: !!id
  })
}

export const useCreateOwner = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: apiService.owners.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owners'] })
      toast.success('Owner created successfully')
    }
  })
}

export const useUpdateOwnerStatus = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }) => apiService.owners.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owners'] })
      toast.success('Owner status updated successfully')
    }
  })
}

// Players hooks
export const usePlayers = (params = {}) => {
  return useQuery({
    queryKey: ['players', params],
    queryFn: () => apiService.players.list(params).then(res => res.data)
  })
}

export const usePlayer = (id) => {
  return useQuery({
    queryKey: ['players', id],
    queryFn: () => apiService.players.detail(id).then(res => res.data),
    enabled: !!id
  })
}

// Bookings hooks
export const useBookings = (params = {}) => {
  return useQuery({
    queryKey: ['bookings', params],
    queryFn: () => apiService.bookings.list(params).then(res => res.data)
  })
}

export const useBooking = (id) => {
  return useQuery({
    queryKey: ['bookings', id],
    queryFn: () => apiService.bookings.detail(id).then(res => res.data),
    enabled: !!id
  })
}

export const useCancelBooking = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, reason }) => apiService.bookings.cancel(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
      toast.success('Booking cancelled successfully')
    }
  })
}

// Payouts hooks
export const usePayouts = (params = {}) => {
  return useQuery({
    queryKey: ['payouts', params],
    queryFn: () => apiService.payouts.list(params).then(res => res.data)
  })
}

export const useGeneratePayouts = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: apiService.payouts.generate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payouts'] })
      toast.success('Payouts generated successfully')
    }
  })
}

export const useReleasePayouts = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: apiService.payouts.release,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payouts'] })
      toast.success('Payouts released successfully')
    }
  })
}

// Coupons hooks
export const useCoupons = (params = {}) => {
  return useQuery({
    queryKey: ['coupons', params],
    queryFn: () => apiService.coupons.list(params).then(res => res.data)
  })
}

export const useCreateCoupon = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: apiService.coupons.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] })
      toast.success('Coupon created successfully')
    }
  })
}

// Reviews hooks
export const useReviews = (params = {}) => {
  return useQuery({
    queryKey: ['reviews', params],
    queryFn: () => apiService.reviews.list(params).then(res => res.data)
  })
}

export const useUpdateReviewStatus = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }) => apiService.reviews.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] })
      toast.success('Review status updated successfully')
    }
  })
}

// Reports hooks
export const useBookingsReport = (params = {}) => {
  return useQuery({
    queryKey: ['reports', 'bookings', params],
    queryFn: () => apiService.reports.bookings(params).then(res => res.data)
  })
}

export const useTurfWiseReport = (params = {}) => {
  return useQuery({
    queryKey: ['reports', 'turf-wise', params],
    queryFn: () => apiService.reports.turfWise(params).then(res => res.data)
  })
}

// Settings hooks
export const useSettings = () => {
  return useQuery({
    queryKey: ['settings'],
    queryFn: () => apiService.settings.list().then(res => res.data)
  })
}

export const useUpdateSettings = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: apiService.settings.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] })
      toast.success('Settings updated successfully')
    }
  })
}

// Subscriptions hooks
export const useSubscriptions = (params = {}) => {
  return useQuery({
    queryKey: ['subscriptions', params],
    queryFn: () => apiService.subscriptions.list(params).then(res => res.data)
  })
}

export const useSubscriptionPlans = () => {
  return useQuery({
    queryKey: ['subscriptions', 'plans'],
    queryFn: () => apiService.subscriptions.plans().then(res => res.data)
  })
}

// Logs hooks
export const useActivityLogs = (params = {}) => {
  return useQuery({
    queryKey: ['logs', 'activity', params],
    queryFn: () => apiService.logs.activity(params).then(res => res.data)
  })
}