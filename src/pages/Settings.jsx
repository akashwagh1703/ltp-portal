import { useState, useEffect } from 'react'
import { Save, MessageSquare, Settings as SettingsIcon, QrCode } from 'lucide-react'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { settingService } from '../services/settingService'
import toast from 'react-hot-toast'

export default function Settings() {
  const [activeTab, setActiveTab] = useState('upi')
  const [commissionRate, setCommissionRate] = useState('5.00')
  const [smsSettings, setSmsSettings] = useState({
    sms_enabled: false,
    default_otp_enabled: true,
    default_otp: '',
    msg91_auth_key: '',
    msg91_sender_id: 'LTPLAY',
    msg91_otp_template_id: '',
    msg91_booking_template_id: '',
    msg91_cancel_template_id: '',
    msg91_dlt_entity_id: ''
  })
  const [platformUpi, setPlatformUpi] = useState({
    upi_id: '',
    qr_url: '',
    file: null,
    preview: ''
  })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    setLoading(true)
    try {
      const [commissionResponse, smsResponse, upiResponse] = await Promise.all([
        settingService.getCommissionRate(),
        settingService.getSmsSettings(),
        settingService.getPlatformUpi()
      ])
      setCommissionRate(commissionResponse.commission_rate || '5.00')
      setSmsSettings(smsResponse)
      const upi = upiResponse.data || upiResponse
      setPlatformUpi({
        upi_id: upi.upi_id || '',
        qr_url: upi.qr_url || '',
        file: null,
        preview: ''
      })
    } catch (error) {
      console.error('Load settings error:', error)
      toast.error('Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  const handleCommissionSave = async () => {
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

  const handleSmsSave = async () => {
    setSaving(true)
    try {
      await settingService.updateSmsSettings(smsSettings)
      toast.success('SMS settings updated successfully')
    } catch (error) {
      console.error('Save SMS settings error:', error)
      toast.error(error.response?.data?.message || 'Failed to update SMS settings')
    } finally {
      setSaving(false)
    }
  }

  const handlePlatformUpiSave = async () => {
    if (!platformUpi.upi_id && !platformUpi.file) {
      toast.error('Add a UPI ID or QR image')
      return
    }

    setSaving(true)
    try {
      const form = new FormData()
      if (platformUpi.upi_id) form.append('upi_id', platformUpi.upi_id)
      if (platformUpi.file) form.append('qr', platformUpi.file)
      const response = await settingService.updatePlatformUpi(form)
      const saved = response.data || response
      setPlatformUpi({
        upi_id: saved.upi_id || platformUpi.upi_id,
        qr_url: saved.qr_url || platformUpi.qr_url,
        file: null,
        preview: ''
      })
      toast.success(response.message || 'Platform UPI saved')
    } catch (error) {
      console.error('Save platform UPI error:', error)
      toast.error(error.response?.data?.message || 'Failed to save platform UPI')
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

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('upi')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'upi'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <QrCode className="h-4 w-4 inline mr-2" />
            Platform UPI
          </button>
          <button
            onClick={() => setActiveTab('commission')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'commission'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <SettingsIcon className="h-4 w-4 inline mr-2" />
            Commission
          </button>
          <button
            onClick={() => setActiveTab('sms')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'sms'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <MessageSquare className="h-4 w-4 inline mr-2" />
            SMS & OTP
          </button>
        </nav>
      </div>

      {/* Commission Settings Tab */}
      {activeTab === 'commission' && (
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
                Kept for reports only. v3 does not take a cut of bookings — players pay the owner directly.
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-amber-900 mb-2">v3 money model</h3>
              <p className="text-sm text-amber-800">
                LTP never holds booking money. Owners pay a monthly or yearly fee by scanning the platform QR (Platform UPI tab).
              </p>
            </div>

            <Button
              onClick={handleCommissionSave}
              loading={saving}
              icon={<Save className="h-4 w-4" />}
            >
              Save Commission Settings
            </Button>
          </div>
        </div>
      )}

      {/* SMS Settings Tab */}
      {activeTab === 'sms' && (
        <div className="space-y-6">
          {/* SMS Control */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">SMS & OTP Configuration</h2>
            
            <div className="space-y-6">
              {/* SMS Enable/Disable */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">SMS Notifications</h3>
                  <p className="text-sm text-gray-500">Enable SMS for OTP and booking confirmations</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={smsSettings.sms_enabled}
                    onChange={(e) => setSmsSettings({...smsSettings, sms_enabled: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {/* Default OTP Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">Default OTP</h3>
                    <p className="text-sm text-gray-500">Enable testing with fixed OTP</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={smsSettings.default_otp_enabled}
                      onChange={(e) => setSmsSettings({...smsSettings, default_otp_enabled: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Default OTP Value</label>
                  <Input
                    type="text"
                    maxLength="6"
                    value={smsSettings.default_otp}
                    onChange={(e) => setSmsSettings({...smsSettings, default_otp: e.target.value})}
                    placeholder="6-digit OTP"
                    disabled={!smsSettings.default_otp_enabled}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* MSG91 Configuration */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">MSG91 Configuration</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Auth Key *</label>
                <Input
                  type="password"
                  value={smsSettings.msg91_auth_key}
                  onChange={(e) => setSmsSettings({...smsSettings, msg91_auth_key: e.target.value})}
                  placeholder="Enter MSG91 Auth Key"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sender ID</label>
                <Input
                  type="text"
                  maxLength="6"
                  value={smsSettings.msg91_sender_id}
                  onChange={(e) => setSmsSettings({...smsSettings, msg91_sender_id: e.target.value})}
                  placeholder="LTPLAY"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">OTP Template ID</label>
                <Input
                  type="text"
                  value={smsSettings.msg91_otp_template_id}
                  onChange={(e) => setSmsSettings({...smsSettings, msg91_otp_template_id: e.target.value})}
                  placeholder="Enter OTP Template ID"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Booking Template ID</label>
                <Input
                  type="text"
                  value={smsSettings.msg91_booking_template_id}
                  onChange={(e) => setSmsSettings({...smsSettings, msg91_booking_template_id: e.target.value})}
                  placeholder="Enter Booking Template ID"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cancel Template ID</label>
                <Input
                  type="text"
                  value={smsSettings.msg91_cancel_template_id}
                  onChange={(e) => setSmsSettings({...smsSettings, msg91_cancel_template_id: e.target.value})}
                  placeholder="Enter Cancel Template ID"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">DLT Entity ID</label>
                <Input
                  type="text"
                  value={smsSettings.msg91_dlt_entity_id}
                  onChange={(e) => setSmsSettings({...smsSettings, msg91_dlt_entity_id: e.target.value})}
                  placeholder="Enter DLT Entity ID"
                />
              </div>
            </div>

            <div className="mt-6">
              <Button
                onClick={handleSmsSave}
                loading={saving}
                icon={<Save className="h-4 w-4" />}
              >
                Save SMS Settings
              </Button>
            </div>
          </div>

          {/* Status Info */}
          <div className={`border rounded-lg p-4 ${
            smsSettings.sms_enabled ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'
          }`}>
            <h3 className={`text-sm font-medium mb-2 ${
              smsSettings.sms_enabled ? 'text-green-900' : 'text-yellow-900'
            }`}>
              {smsSettings.sms_enabled ? '✅ SMS Enabled' : '⚠️ SMS Disabled'}
            </h3>
            <div className={`text-sm space-y-1 ${
              smsSettings.sms_enabled ? 'text-green-800' : 'text-yellow-800'
            }`}>
              <p>• Default OTP: {smsSettings.default_otp_enabled ? `Enabled (${smsSettings.default_otp})` : 'Disabled (Random OTP)'}</p>
              <p>• MSG91 Auth Key: {smsSettings.msg91_auth_key ? 'Configured' : 'Not Set'}</p>
              <p>• Templates: {smsSettings.msg91_otp_template_id ? 'Configured' : 'Using Fallback SMS'}</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'upi' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Platform UPI</h2>
            <p className="text-sm text-gray-500 mb-6">
              Owners scan this QR to pay Let’s Turf Play the monthly or yearly fee.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">UPI ID</label>
                  <Input
                    type="text"
                    value={platformUpi.upi_id}
                    onChange={(e) => setPlatformUpi({ ...platformUpi, upi_id: e.target.value })}
                    placeholder="letsturfplay@upi"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">QR image</label>
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      setPlatformUpi({
                        ...platformUpi,
                        file,
                        preview: URL.createObjectURL(file)
                      })
                    }}
                    className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-100 file:font-medium"
                  />
                </div>
                <Button
                  onClick={handlePlatformUpiSave}
                  loading={saving}
                  icon={<Save className="h-4 w-4" />}
                >
                  Save platform UPI
                </Button>
              </div>
              <div className="flex items-center justify-center rounded-xl border border-gray-200 bg-gray-50 p-4 min-h-[240px]">
                {platformUpi.preview || platformUpi.qr_url ? (
                  <img
                    src={platformUpi.preview || platformUpi.qr_url}
                    alt="LTP UPI QR"
                    className="max-h-56 max-w-full object-contain"
                  />
                ) : (
                  <p className="text-sm text-gray-500 text-center">No QR uploaded yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'commission' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-yellow-900 mb-2">Note</h3>
          <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
            <li>v3 does not take a booking commission. This rate is display/report only.</li>
            <li>Owner fees are confirmed on the Subscriptions page, not here.</li>
          </ul>
        </div>
      )}
    </div>
  )
}
