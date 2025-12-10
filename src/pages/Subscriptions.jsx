import React, { useState, useEffect } from 'react';
import { subscriptionService } from '../services/subscriptionService';
import DataTable from '../components/table/DataTable';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { formatDate, formatCurrency } from '../utils/formatters';

export default function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);

  useEffect(() => {
    loadSubscriptions();
    loadStatistics();
  }, [filter]);

  const loadSubscriptions = async () => {
    setLoading(true);
    try {
      const params = filter !== 'all' ? { status: filter } : {};
      const response = await subscriptionService.getAll(params);
      setSubscriptions(response.data.data || []);
    } catch (error) {
      console.error('Error loading subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const response = await subscriptionService.getStatistics();
      setStatistics(response.data);
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  };

  const handleRenew = async (subscription) => {
    setSelectedSubscription(subscription);
    setShowRenewModal(true);
  };

  const confirmRenew = async () => {
    try {
      await subscriptionService.renew(selectedSubscription.id, {
        amount_paid: selectedSubscription.plan.price,
      });
      setShowRenewModal(false);
      loadSubscriptions();
      loadStatistics();
      alert('Subscription renewed successfully');
    } catch (error) {
      console.error('Error renewing subscription:', error);
      alert('Failed to renew subscription');
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      expiring_soon: 'bg-yellow-100 text-yellow-800',
      expired: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status]}`}>
        {status.replace('_', ' ').toUpperCase()}
      </span>
    );
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { 
      key: 'owner', 
      label: 'Owner Name',
      render: (row) => row.owner?.name || 'N/A'
    },
    { 
      key: 'turf', 
      label: 'Turf Name',
      render: (row) => row.owner?.turfs?.[0]?.name || 'N/A'
    },
    { 
      key: 'plan', 
      label: 'Plan',
      render: (row) => row.plan?.name || 'N/A'
    },
    { 
      key: 'amount_paid', 
      label: 'Amount',
      render: (row) => formatCurrency(row.amount_paid)
    },
    { 
      key: 'start_date', 
      label: 'Start Date',
      render: (row) => formatDate(row.start_date)
    },
    { 
      key: 'end_date', 
      label: 'Expiry Date',
      render: (row) => formatDate(row.end_date)
    },
    { 
      key: 'status', 
      label: 'Status',
      render: (row) => getStatusBadge(row.status)
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <Button
          size="sm"
          variant={row.status === 'expired' ? 'primary' : 'secondary'}
          onClick={() => handleRenew(row)}
        >
          Renew
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Subscription Management</h1>
        <p className="text-gray-600">Manage turf owner subscriptions</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-sm text-gray-600">Total Subscriptions</p>
          <p className="text-2xl font-bold">{statistics.total || 0}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg shadow">
          <p className="text-sm text-green-600">Active</p>
          <p className="text-2xl font-bold text-green-700">{statistics.active || 0}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg shadow">
          <p className="text-sm text-yellow-600">Expiring Soon</p>
          <p className="text-2xl font-bold text-yellow-700">{statistics.expiring_soon || 0}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg shadow">
          <p className="text-sm text-red-600">Expired</p>
          <p className="text-2xl font-bold text-red-700">{statistics.expired || 0}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-4 flex gap-2">
        {['all', 'active', 'expiring_soon', 'expired'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium ${
              filter === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status.replace('_', ' ').toUpperCase()}
          </button>
        ))}
      </div>

      {/* Subscriptions Table */}
      <div className="bg-white rounded-lg shadow">
        <DataTable
          columns={columns}
          data={subscriptions}
          loading={loading}
        />
      </div>

      {/* Renew Modal */}
      {showRenewModal && selectedSubscription && (
        <Modal
          isOpen={showRenewModal}
          onClose={() => setShowRenewModal(false)}
          title="Renew Subscription"
        >
          <div className="space-y-4">
            <p>
              Renew subscription for <strong>{selectedSubscription.owner?.name}</strong>?
            </p>
            <div className="bg-gray-50 p-4 rounded">
              <p className="text-sm text-gray-600">Plan: {selectedSubscription.plan?.name}</p>
              <p className="text-sm text-gray-600">
                Amount: {formatCurrency(selectedSubscription.plan?.price)}
              </p>
              <p className="text-sm text-gray-600">
                Duration: {selectedSubscription.plan?.duration_days} days
              </p>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="secondary" onClick={() => setShowRenewModal(false)}>
                Cancel
              </Button>
              <Button onClick={confirmRenew}>Confirm Renewal</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
