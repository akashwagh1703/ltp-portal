import { motion } from 'framer-motion'
import { Trophy, MapPin, Star } from 'lucide-react'

export default function TopTurfsWidget({ turfs = [] }) {
  const formatCurrency = (value) => `₹${value.toLocaleString()}`

  const getRankIcon = (index) => {
    if (index === 0) return <Trophy className="h-4 w-4 text-yellow-500" />
    if (index === 1) return <div className="w-4 h-4 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
    if (index === 2) return <div className="w-4 h-4 bg-orange-400 rounded-full flex items-center justify-center text-white text-xs font-bold">3</div>
    return <div className="w-4 h-4 bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-xs font-bold">{index + 1}</div>
  }

  const getRankColor = (index) => {
    if (index === 0) return 'border-l-yellow-500 bg-yellow-50'
    if (index === 1) return 'border-l-gray-400 bg-gray-50'
    if (index === 2) return 'border-l-orange-400 bg-orange-50'
    return 'border-l-gray-300 bg-white'
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="h-5 w-5 text-yellow-500" />
        <h3 className="text-lg font-semibold text-gray-900">Top Performing Turfs</h3>
      </div>
      
      {turfs.length === 0 ? (
        <div className="text-center py-8">
          <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No turf data available</p>
        </div>
      ) : (
        <div className="space-y-3">
          {turfs.slice(0, 5).map((turf, index) => (
            <motion.div
              key={turf.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border-l-4 ${getRankColor(index)} transition-all hover:shadow-sm`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getRankIcon(index)}
                  <div>
                    <h4 className="font-medium text-gray-900">{turf.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-500">{turf.location}</span>
                      {turf.rating && (
                        <>
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                          <span className="text-xs text-gray-500">{turf.rating}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{formatCurrency(turf.revenue)}</p>
                  <p className="text-xs text-gray-500">{turf.bookings} bookings</p>
                </div>
              </div>
              
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Performance</span>
                  <span>{turf.performance}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${turf.performance}%` }}
                    transition={{ delay: index * 0.1 + 0.3, duration: 0.5 }}
                    className="bg-blue-500 h-1.5 rounded-full"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}