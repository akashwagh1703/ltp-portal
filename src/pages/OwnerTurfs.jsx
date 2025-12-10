import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Button from '../components/ui/Button'
import DataTable from '../components/table/DataTable'
import { formatCurrency } from '../utils/formatters'
import { STATUS_COLORS } from '../utils/constants'
import { useOwner } from '../api/hooks/useOwners'
import { useTurfs } from '../api/hooks/useTurfs'

export default function OwnerTurfs() {
  const { ownerId } = useParams()
  const navigate = useNavigate()
  
  const { data: owner } = useOwner(ownerId)
  const { data: allTurfs = [] } = useTurfs()
  const ownerTurfs = allTurfs.filter(t => t.owner_id === parseInt(ownerId))

  const columns = [
    { key: 'turf_id', label: 'ID', sortable: true },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'sport_type', label: 'Sport', sortable: true },
    { 
      key: 'price_per_hour', 
      label: 'Price/Hour',
      render: (row) => formatCurrency(row.price_per_hour)
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[row.status]}`}>
          {row.status}
        </span>
      )
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate('/owners')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{owner?.name}'s Turfs</h1>
          <p className="text-gray-600 mt-1">{ownerTurfs.length} turfs owned</p>
        </div>
      </div>

      <DataTable columns={columns} data={ownerTurfs} />
    </div>
  )
}
