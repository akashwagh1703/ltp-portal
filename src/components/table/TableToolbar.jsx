import { Search, Filter } from 'lucide-react'
import Input from '../ui/Input'
import Button from '../ui/Button'

export default function TableToolbar({ 
  searchValue, 
  onSearchChange, 
  onFilterClick,
  placeholder = 'Search...'
}) {
  return (
    <div className="flex items-center gap-4 mb-4">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      {onFilterClick && (
        <Button variant="outline" onClick={onFilterClick}>
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      )}
    </div>
  )
}
