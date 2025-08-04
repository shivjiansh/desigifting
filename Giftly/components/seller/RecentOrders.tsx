// components/seller/RecentOrders.tsx
export function RecentOrders() {
  const orders = [
    { id: '#GF-1001', customer: 'Alex Johnson', amount: '$89.99', status: 'Shipped' },
    { id: '#GF-1002', customer: 'Sarah Williams', amount: '$124.50', status: 'Processing' },
    { id: '#GF-1003', customer: 'Michael Brown', amount: '$56.25', status: 'Delivered' },
    { id: '#GF-1004', customer: 'Emily Davis', amount: '$78.30', status: 'Shipped' },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Shipped':
        return 'bg-blue-100 text-blue-800'
      case 'Processing':
        return 'bg-yellow-100 text-yellow-800'
      case 'Delivered':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Orders</h3>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">{order.id}</p>
              <p className="text-sm text-gray-500">{order.customer}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{order.amount}</p>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                  order.status
                )}`}
              >
                {order.status}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <a
          href="/seller/orders"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          View all orders
        </a>
      </div>
    </div>
  )
}