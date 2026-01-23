import { useState } from 'react'
import { Send, Users, UserCheck, Bell, MessageSquare } from 'lucide-react'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { notificationService } from '../services/notificationService'

export default function SendNotification() {
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    target: 'all', // all, owners, players, specific
    user_ids: [],
    scheduled_at: ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      await notificationService.send(formData)
      toast.success('Notification sent successfully!')
      setFormData({
        title: '',
        message: '',
        target: 'all',
        user_ids: [],
        scheduled_at: ''
      })
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send notification')
    } finally {
      setLoading(false)
    }
  }

  const targetOptions = [
    { value: 'all', label: 'All Users', icon: Users, color: 'blue' },
    { value: 'owners', label: 'Turf Owners', icon: UserCheck, color: 'green' },
    { value: 'players', label: 'Players', icon: Users, color: 'purple' }
  ]

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900">Send Notification</h1>
        <p className="text-gray-600 mt-1">Broadcast messages to users across the platform</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notification Form */}
        <div className="lg:col-span-2">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-center gap-2 mb-6">
              <Bell className="h-5 w-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-900">Compose Notification</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Notification Title"
                placeholder="Enter notification title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows="4"
                  placeholder="Enter your message here..."
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">{formData.message.length}/500 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Target Audience</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {targetOptions.map((option) => {
                    const Icon = option.icon
                    return (
                      <motion.label
                        key={option.value}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`relative flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          formData.target === option.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="target"
                          value={option.value}
                          checked={formData.target === option.value}
                          onChange={(e) => setFormData({...formData, target: e.target.value})}
                          className="sr-only"
                        />
                        <Icon className={`h-5 w-5 mr-3 ${
                          formData.target === option.value ? 'text-blue-600' : 'text-gray-400'
                        }`} />
                        <span className={`text-sm font-medium ${
                          formData.target === option.value ? 'text-blue-900' : 'text-gray-700'
                        }`}>
                          {option.label}
                        </span>
                      </motion.label>
                    )
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Schedule (Optional)
                </label>
                <input
                  type="datetime-local"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.scheduled_at}
                  onChange={(e) => setFormData({...formData, scheduled_at: e.target.value})}
                />
                <p className="text-xs text-gray-500 mt-1">Leave empty to send immediately</p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  loading={loading}
                  icon={<Send className="h-4 w-4" />}
                  className="flex-1"
                >
                  {formData.scheduled_at ? 'Schedule Notification' : 'Send Now'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setFormData({
                    title: '',
                    message: '',
                    target: 'all',
                    user_ids: [],
                    scheduled_at: ''
                  })}
                >
                  Clear
                </Button>
              </div>
            </form>
          </motion.div>
        </div>

        {/* Preview & Stats */}
        <div className="space-y-6">
          {/* Preview */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
            <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bell className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">
                    {formData.title || 'Notification Title'}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {formData.message || 'Your notification message will appear here...'}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">Just now</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Quick Templates */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Templates</h3>
            <div className="space-y-2">
              {[
                {
                  title: 'System Maintenance',
                  message: 'Scheduled maintenance will occur tonight from 2-4 AM. Service may be temporarily unavailable.'
                },
                {
                  title: 'New Feature Update',
                  message: 'We\'ve added exciting new features to improve your experience. Check them out now!'
                },
                {
                  title: 'Payment Reminder',
                  message: 'Your subscription expires soon. Renew now to continue enjoying our services.'
                }
              ].map((template, index) => (
                <button
                  key={index}
                  onClick={() => setFormData({
                    ...formData,
                    title: template.title,
                    message: template.message
                  })}
                  className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <p className="font-medium text-sm text-gray-900">{template.title}</p>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{template.message}</p>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}