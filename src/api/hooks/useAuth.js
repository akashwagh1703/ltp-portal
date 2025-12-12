import { useMutation } from '@tanstack/react-query'
import client from '../client'
import { endpoints } from '../endpoints'
import toast from 'react-hot-toast'

export const useLogin = () => {
  return useMutation({
    mutationFn: async (credentials) => {
      const { data } = await client.post(endpoints.auth.login, credentials)
      return data
    },
    onSuccess: (data) => {
      localStorage.setItem('admin_token', data.token)
      localStorage.setItem('admin_user', JSON.stringify(data.user))
      toast.success('Login successful')
    }
  })
}

export const useLogout = () => {
  return useMutation({
    mutationFn: async () => {
      await client.post(endpoints.auth.logout)
    },
    onSuccess: () => {
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_user')
      toast.success('Logged out successfully')
    }
  })
}

export const getAuthUser = () => {
  const user = localStorage.getItem('admin_user')
  return user ? JSON.parse(user) : null
}

export const isAuthenticated = () => {
  return !!localStorage.getItem('admin_token')
}
