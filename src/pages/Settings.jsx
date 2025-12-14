import { useState, useEffect } from 'react'
import { Save } from 'lucide-react'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { settingService } from '../services/settingService'
import toast from 'react-hot-toast'

export default function Settings() {
  const [commissionRate, setCommissionRate] = useState('5.00')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    setLoading(true)
    try {
      const response = await settingService.getCommissionRate()
      setCommissionRate(response.commission_rate || '5.00')
    } catch (error) {
      console.error('Load settings error:', error)
      toast.error('Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!commissionRate || parseFloat(commissionRate) < 0 || parseFloat(commissionRate) > 100) {
      toast.error('Commission rate must be between 0 and 100')
      return
    }

    setSaving(true)
    try {
      await settingService.updateCommissionRate(parseFloat(commissionRate))
      toast.success('Commission rate updated successfully')
    } catch (error) {
      console.error('Save settings error:', error)
      toast.error(error.response?.data?.message || 'Failed to update settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Platform Settings</h1>
        <p className="text-gray-600 mt-1">Configure platform-wide settings</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Commission Settings</h2>
        
        <div className="max-w-md space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Platform Commission Rate (%)
            </label>
            <Input
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={commissionRate}
              onChange={(e) => setCommissionRate(e.target.value)}
              placeholder="5.00"
            />
            <p className="text-sm text-gray-500 mt-2">
              Percentage of booking amount charged as platform commission
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-900 mb-2">Example Calculation:</h3>
            <div className="text-sm text-blue-800 space-y-1">
              <p>Booking Amount: ₹1,000</p>
              <p>Commission ({commissionRate}%): ₹{((1000 * parseFloat(commissionRate || 0)) / 100).toFixed(2)}</p>
              <p>Owner Receives: ₹{(1000 - ((1000 * parseFloat(commissionRate || 0)) / 100)).toFixed(2)}</p>
            </div>
          </div>

          <Button
            onClick={handleSave}
            loading={saving}
            icon={<Save className="h-4 w-4" />}
          >
            Save Settings
          </Button>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-yellow-900 mb-2">⚠️ Important Notes:</h3>
        <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
          <li>Commission rate applies to all new bookings</li>
          <li>Existing bookings retain their original commission rate</li>
          <li>Changes take effect immediately</li>
          <li>Recommended rate: 5-10% for marketplace platforms</li>
        </ul>
      </div>
    </div>
  )
}
