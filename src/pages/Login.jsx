import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import { useLogin } from '../api/hooks/useAuth'

export default function Login() {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const { register, handleSubmit, formState: { errors } } = useForm()
  const loginMutation = useLogin()

  const onSubmit = async (data) => {
    setError('')
    try {
      await loginMutation.mutateAsync(data)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-light to-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">Let's Turf Play</h1>
          <p className="text-gray-600">Admin Portal</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <Input
            label="Email"
            type="email"
            placeholder="Enter email"
            error={errors.email?.message}
            {...register('email', { required: 'Email is required' })}
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter password"
            error={errors.password?.message}
            {...register('password', { required: 'Password is required' })}
          />

          <Button
            type="submit"
            className="w-full"
            loading={loginMutation.isPending}
          >
            Login
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Default: admin@letsturf.com / admin123
        </p>
      </motion.div>
    </div>
  )
}
