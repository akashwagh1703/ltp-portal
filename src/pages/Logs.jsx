import { useState } from 'react'
import { Filter, Download } from 'lucide-react'
import DataTable from '../components/table/DataTable'
import Button from '../components/ui/Button'
import Select from '../components/ui/Select'
import { formatDateTime } from '../utils/formatters'
import { useActivityLogs } from '../api/hooks/useLogs'

export default function Logs() {
  const [logType, setLogType] = useState('all')
  const { data: activityLogs = [] } = useActivityLogs()



  const apiColumns = [
    { key: 'method', label: 'Method', sortable: true },
    { key: 'endpoint', label: 'Endpoint', sortable: true },
    { 
      key: 'status', 
      label: 'Status',
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          row.status === 200 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {row.status}
        </span>
      )
    },
    { key: 'user', label: 'User', sortable: true },
    { key: 'timestamp', label: 'Time', render: (row) => formatDateTime(row.timestamp) }
  ]

  const activityColumns = [
    { key: 'action', label: 'Action', sortable: true },
    { key: 'details', label: 'Details' },
    { key: 'user', label: 'User', sortable: true },
    { key: 'timestamp', label: 'Time', render: (row) => formatDateTime(row.timestamp) }
  ]

  const errorColumns = [
    { key: 'error', label: 'Error', sortable: true },
    { key: 'message', label: 'Message' },
    { 
      key: 'severity', 
      label: 'Severity',
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          row.severity === 'Critical' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {row.severity}
        </span>
      )
    },
    { key: 'timestamp', label: 'Time', render: (row) => formatDateTime(row.timestamp) }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Logs & Audit</h1>
          <p className="text-gray-600 mt-1">View system logs and activity</p>
        </div>
        <div className="flex gap-3">
          <Select
            value={logType}
            onChange={setLogType}
            options={[
              { value: 'all', label: 'All Logs' },
              { value: 'api', label: 'API Logs' },
              { value: 'activity', label: 'Activity Logs' },
              { value: 'error', label: 'Error Logs' }
            ]}
          />
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {(logType === 'all' || logType === 'activity') && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Logs</h3>
          <DataTable columns={activityColumns} data={activityLogs} pageSize={5} />
        </div>
      )}
    </div>
  )
}
