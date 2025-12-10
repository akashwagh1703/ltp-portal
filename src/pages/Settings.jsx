import { useState, useEffect } from 'react'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Select from '../components/ui/Select'
import toast from 'react-hot-toast'
import { useSettings, useUpdateSetting } from '../api/hooks/useSettings'

export default function Settings() {
  const { data: settings = {}, isLoading } = useSettings()
  const updateMutation = useUpdateSetting()
  
  const [commission, setCommission] = useState('10')
  const [gatewayStatus, setGatewayStatus] = useState('active')
  
  useEffect(() => {
    if (settings.commission_percentage) {
      setCommission(settings.commission_percentage)
    }
    if (settings.payment_gateway_status) {
      setGatewayStatus(settings.payment_gateway_status)
    }
  }, [settings])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage platform settings and configuration</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h3>
          <div className="space-y-4 max-w-2xl">
            <Input label="Platform Name" defaultValue="Let's Turf Play" />
            <Input label="Support Email" type="email" defaultValue="support@letsturf.com" />
            <Input label="Support Phone" type="text" defaultValue="9876543210" />
            <Input label="App Version" defaultValue="1.0.0" disabled />
            <Button onClick={() => toast.success('Settings saved')} disabled={isLoading}>Save Changes</Button>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Commission Settings</h3>
          <div className="space-y-4 max-w-2xl">
            <Input 
              label="Default Commission (%)" 
              type="text" 
              value={commission}
              onChange={(e) => setCommission(e.target.value)}
              placeholder="10"
            />
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700">
                Current commission: <span className="font-semibold">{commission}%</span>
              </p>
              <p className="text-xs text-gray-600 mt-1">
                This will be applied to all new payouts
              </p>
            </div>
            <Button 
              onClick={() => updateMutation.mutate({ key: 'commission_percentage', value: commission })}
              disabled={updateMutation.isPending}
            >
              Update Commission
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Gateway</h3>
          <div className="space-y-4 max-w-2xl">
            <Select
              label="Gateway Status"
              value={gatewayStatus}
              onChange={setGatewayStatus}
              options={[
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
                { value: 'test', label: 'Test Mode' }
              ]}
            />
            <Input label="API Key" type="password" defaultValue="sk_test_xxxxxxxxxxxxx" />
            <Input label="Secret Key" type="password" defaultValue="sk_secret_xxxxxxxxxxxxx" />
            <div className="flex items-center gap-4">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                gatewayStatus === 'active' ? 'bg-green-100 text-green-800' : 
                gatewayStatus === 'test' ? 'bg-yellow-100 text-yellow-800' : 
                'bg-red-100 text-red-800'
              }`}>
                {gatewayStatus === 'active' ? '● Live' : gatewayStatus === 'test' ? '● Test Mode' : '● Inactive'}
              </div>
            </div>
            <Button 
              onClick={() => updateMutation.mutate({ key: 'payment_gateway_status', value: gatewayStatus })}
              disabled={updateMutation.isPending}
            >
              Save Gateway Settings
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Profile</h3>
          <div className="space-y-4 max-w-2xl">
            <Input label="Name" defaultValue="Admin User" />
            <Input label="Email" type="email" defaultValue="admin@ltp.com" />
            <Input label="Current Password" type="password" placeholder="Enter current password" />
            <Input label="New Password" type="password" placeholder="Enter new password" />
            <Input label="Confirm Password" type="password" placeholder="Confirm new password" />
            <Button onClick={() => toast.success('Profile updated')}>Update Profile</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
