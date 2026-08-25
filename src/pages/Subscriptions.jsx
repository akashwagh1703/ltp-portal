import React, { useState, useEffect } from 'react';
import { subscriptionService } from '../services/subscriptionService';
import DataTable from '../components/table/DataTable';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { formatDate, formatCurrency } from '../utils/formatters';
import toast from 'react-hot-toast';

export default function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [feePayments, setFeePayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [feeBusyId, setFeeBusyId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState(null);

  useEffect(() => {
    loadSubscriptions();
    loadStatistics();
    loadFeePayments();
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

  const loadFeePayments = async () => {
    try {
      const response = await subscriptionService.getFeePayments({ status: 'awaiting_admin' });
      setFeePayments(response.data.data || []);
    } catch (error) {
      console.error('Error loading fee payments:', error);
    }
  };

  const handleConfirmFee = async (payment) => {
    setFeeBusyId(payment.id);
    try {
      const response = await subscriptionService.confirmFee(payment.id);
      toast.success(response.data.message || 'Fee confirmed. Plan dates updated.');
      loadFeePayments();
      loadSubscriptions();
      loadStatistics();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not confirm fee');
    } finally {
      setFeeBusyId(null);
    }
  };

  const handleRejectFee = async (payment) => {
    if (!window.confirm(`Didn’t receive ₹${Number(payment.amount).toFixed(0)} from ${payment.owner?.name || 'this owner'}?`)) {
      return;
    }
    setFeeBusyId(payment.id);
    try {
      await subscriptionService.rejectFee(payment.id);
      toast.success('Told the owner the fee was not received.');
      loadFeePayments();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Could not reject fee');
    } finally {
      setFeeBusyId(null);
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
        <h1 className="text-2xl font-bold text-gray-900">Subscriptions</h1>
        <p className="text-gray-600">Confirm Pay LTP fees, then review owner plans</p>
      </div>

      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Pay LTP inbox</h2>
          {feePayments.length > 0 && (
            <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded-full">
              {feePayments.length} waiting
            </span>
          )}
        </div>
        {feePayments.length === 0 ? (
          <p className="text-sm text-gray-500">No fee payments waiting. Owners tap “I have paid” after scanning the LTP QR.</p>
        ) : (
          <div className="space-y-3">
            {feePayments.map((payment) => (
              <div
                key={payment.id}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 rounded-lg border border-gray-200 bg-gray-50"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {payment.owner?.name || 'Owner'} · {formatCurrency(payment.amount)} · {payment.plan?.name || 'Plan'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {payment.owner?.phone || ''}
                    {payment.marked_paid_at ? ` · marked paid ${formatDate(payment.marked_paid_at)}` : ''}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="success"
                    disabled={feeBusyId === payment.id}
                    onClick={() => handleConfirmFee(payment)}
                  >
                    Confirm payment
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={feeBusyId === payment.id}
                    onClick={() => handleRejectFee(payment)}
                  >
                    Didn’t receive
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
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
                ? 'bg-primary text-white'
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
