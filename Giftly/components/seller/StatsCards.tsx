// components/seller/StatsCards.tsx
export function StatsCards() {
  const stats = [
    { name: 'Total Revenue', value: '$12,345', change: '+12%', changeType: 'positive' },
    { name: 'Orders', value: '256', change: '+8%', changeType: 'positive' },
    { name: 'Products', value: '42', change: '+3', changeType: 'neutral' },
    { name: 'Avg. Rating', value: '4.8', change: '+0.1', changeType: 'positive' },
  ]

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                {/* Icon would go here */}
                <div className="h-6 w-6 text-white"></div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dt className="text-sm font-medium text-gray-500 truncate">
                  {stat.name}
                </dt>
                <dd className="flex items-baseline">
                  <div className="text-2xl font-semibold text-gray-900">
                    {stat.value}
                  </div>
                  <div
                    className={`ml-2 flex items-baseline text-sm font-semibold ${
                      stat.changeType === 'positive'
                        ? 'text-green-600'
                        : stat.changeType === 'negative'
                        ? 'text-red-600'
                        : 'text-gray-500'
                    }`}
                  >
                    {stat.change}
                  </div>
                </dd>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}