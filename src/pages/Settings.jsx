import { useState, useEffect } from 'react'
import { Save, MessageSquare, Settings as SettingsIcon, CreditCard } from 'lucide-react'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { settingService } from '../services/settingService'
import toast from 'react-hot-toast'

export default function Settings() {
  const [activeTab, setActiveTab] = useState('commission')
  const [commissionRate, setCommissionRate] = useState('5.00')
  const [smsSettings, setSmsSettings] = useState({
    sms_enabled: false,
    default_otp_enabled: true,
    default_otp: '999999',
    msg91_auth_key: '',
    msg91_sender_id: 'LTPLAY',
    msg91_otp_template_id: '',
    msg91_booking_template_id: '',
    msg91_cancel_template_id: '',
    msg91_dlt_entity_id: ''
  })
  const [paymentSettings, setPaymentSettings] = useState({
    razorpay_enabled: false,
    razorpay_mode: 'test',
    razorpay_key_id: '',
    razorpay_key_secret: '',
    razorpay_webhook_secret: '',
    razorpay_payouts_enabled: false,
    razorpay_payout_key_id: '',
    razorpay_payout_key_secret: ''
  })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    setLoading(true)
    try {
      const [commissionResponse, smsResponse, paymentResponse] = await Promise.all([
        settingService.getCommissionRate(),
        settingService.getSmsSettings(),
        settingService.getPaymentSettings()
      ])
      setCommissionRate(commissionResponse.commission_rate || '5.00')
      setSmsSettings(smsResponse)
      setPaymentSettings(paymentResponse)
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

  const handlePaymentSave = async () => {
    setSaving(true)
    try {
      await settingService.updatePaymentSettings(paymentSettings)
      toast.success('Payment settings updated successfully')
    } catch (error) {
      console.error('Save payment settings error:', error)
      toast.error(error.response?.data?.message || 'Failed to update payment settings')
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
            onClick={() => setActiveTab('commission')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'commission'
                ? 'border-blue-500 text-blue-600'
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
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <MessageSquare className="h-4 w-4 inline mr-2" />
            SMS & OTP
          </button>
          <button
            onClick={() => setActiveTab('payment')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'payment'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <CreditCard className="h-4 w-4 inline mr-2" />
            Payments
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
                    placeholder="999999"
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

      {/* Payment Settings Tab */}
      {activeTab === 'payment' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Razorpay Configuration</h2>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Razorpay Payments</h3>
                  <p className="text-sm text-gray-500">Enable online payments via Razorpay</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={paymentSettings.razorpay_enabled}
                    onChange={(e) => setPaymentSettings({...paymentSettings, razorpay_enabled: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Razorpay Payouts</h3>
                  <p className="text-sm text-gray-500">Enable automated payouts to turf owners</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={paymentSettings.razorpay_payouts_enabled}
                    onChange={(e) => setPaymentSettings({...paymentSettings, razorpay_payouts_enabled: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Environment</label>
                  <select
                    value={paymentSettings.razorpay_mode}
                    onChange={(e) => setPaymentSettings({...paymentSettings, razorpay_mode: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="test">Test Mode</option>
                    <option value="live">Live Mode</option>
                  </select>
                </div>
                
                <div></div>
                
                <div className="col-span-2">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Credentials</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Payment Key ID *</label>
                      <Input
                        type="text"
                        value={paymentSettings.razorpay_key_id}
                        onChange={(e) => setPaymentSettings({...paymentSettings, razorpay_key_id: e.target.value})}
                        placeholder={paymentSettings.razorpay_mode === 'test' ? 'rzp_test_xxxxxxxxxx' : 'rzp_live_xxxxxxxxxx'}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Payment Key Secret *</label>
                      <Input
                        type="password"
                        value={paymentSettings.razorpay_key_secret}
                        onChange={(e) => setPaymentSettings({...paymentSettings, razorpay_key_secret: e.target.value})}
                        placeholder="Enter Payment Key Secret"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="col-span-2">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Payout Credentials</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Payout Key ID</label>
                      <Input
                        type="text"
                        value={paymentSettings.razorpay_payout_key_id}
                        onChange={(e) => setPaymentSettings({...paymentSettings, razorpay_payout_key_id: e.target.value})}
                        placeholder="rzp_live_xxxxxxxxxx (Live only)"
                        disabled={!paymentSettings.razorpay_payouts_enabled}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Payout Key Secret</label>
                      <Input
                        type="password"
                        value={paymentSettings.razorpay_payout_key_secret}
                        onChange={(e) => setPaymentSettings({...paymentSettings, razorpay_payout_key_secret: e.target.value})}
                        placeholder="Enter Payout Key Secret"
                        disabled={!paymentSettings.razorpay_payouts_enabled}
                      />
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    ⚠️ Payouts only work in Live mode with KYC-verified account
                  </p>
                </div>
              </div>

              <Button
                onClick={handlePaymentSave}
                loading={saving}
                icon={<Save className="h-4 w-4" />}
              >
                Save Payment Settings
              </Button>
            </div>
          </div>

          <div className={`border rounded-lg p-4 ${
            paymentSettings.razorpay_enabled ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'
          }`}>
            <h3 className={`text-sm font-medium mb-2 ${
              paymentSettings.razorpay_enabled ? 'text-green-900' : 'text-yellow-900'
            }`}>
              {paymentSettings.razorpay_enabled ? '✅ Razorpay Enabled' : '⚠️ Razorpay Disabled'}
            </h3>
            <div className={`text-sm space-y-1 ${
              paymentSettings.razorpay_enabled ? 'text-green-800' : 'text-yellow-800'
            }`}>
              <p>• Mode: {paymentSettings.razorpay_mode === 'test' ? 'Test Environment' : 'Live Environment'}</p>
              <p>• Payment Key: {paymentSettings.razorpay_key_id ? 'Configured' : 'Not Set'}</p>
              <p>• Payouts: {paymentSettings.razorpay_payouts_enabled ? 'Enabled' : 'Disabled'}</p>
              <p>• Payout Key: {paymentSettings.razorpay_payout_key_id ? 'Configured' : 'Not Set'}</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'commission' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-yellow-900 mb-2">⚠️ Important Notes:</h3>
          <ul className="text-sm text-yellow-800 space-y-1 list-disc list-inside">
            <li>Commission rate applies to all new bookings</li>
            <li>Existing bookings retain their original commission rate</li>
            <li>Changes take effect immediately</li>
            <li>Recommended rate: 5-10% for marketplace platforms</li>
          </ul>
        </div>
      )}

      {activeTab === 'payment' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-2">🔧 Setup Guide:</h3>
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-semibold text-blue-900">Test Mode:</h4>
              <p className="text-sm text-blue-800">• Use rzp_test_ keys • Test card: 4111 1111 1111 1111</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-blue-900">Live Mode:</h4>
              <p className="text-sm text-blue-800">• Complete KYC • Use rzp_live_ keys • Real payments</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
