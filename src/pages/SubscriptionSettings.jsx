import React, { useState, useEffect } from 'react';
import { subscriptionService } from '../services/subscriptionService';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function SubscriptionSettings() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    setLoading(true);
    try {
      const response = await subscriptionService.getPlans();
      setPlans(response.data);
    } catch (error) {
      console.error('Error loading plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePriceChange = (planId, newPrice) => {
    setPlans(plans.map(plan => 
      plan.id === planId ? { ...plan, price: newPrice } : plan
    ));
  };

  const handleSave = async (plan) => {
    setSaving(true);
    try {
      await subscriptionService.updatePlan(plan.id, { price: plan.price });
      alert('Plan updated successfully');
      loadPlans();
    } catch (error) {
      console.error('Error updating plan:', error);
      alert('Failed to update plan');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Subscription Settings</h1>
        <p className="text-gray-600">Manage subscription plan pricing</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-6">
          {plans.map((plan) => (
            <div key={plan.id} className="border-b pb-6 last:border-b-0">
              <h3 className="text-lg font-semibold mb-4">{plan.name}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Plan Type
                  </label>
                  <p className="text-gray-900 capitalize">{plan.type}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration
                  </label>
                  <p className="text-gray-900">{plan.duration_days} days</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (₹)
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      value={plan.price}
                      onChange={(e) => handlePriceChange(plan.id, e.target.value)}
                      min="0"
                      step="0.01"
                    />
                    <Button
                      onClick={() => handleSave(plan)}
                      disabled={saving}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2">Important Notes:</h4>
        <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
          <li>Price changes will apply to new subscriptions only</li>
          <li>Existing subscriptions will not be affected</li>
          <li>Prices are in Indian Rupees (₹)</li>
        </ul>
      </div>
    </div>
  );
}
