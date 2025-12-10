export default function LineChart({ data, title }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">{title}</h3>
      <div className="h-64 flex items-end justify-between gap-2">
        {data.map((item, idx) => {
          const maxValue = Math.max(...data.map(d => d.value))
          const height = (item.value / maxValue) * 100
          
          return (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex items-end justify-center" style={{ height: '200px' }}>
                <div
                  className="w-full bg-primary rounded-t transition-all duration-500 hover:bg-primary-dark"
                  style={{ height: `${height}%` }}
                />
              </div>
              <span className="text-xs text-gray-600">{item.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
