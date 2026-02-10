import { useState, useEffect } from 'react'
import { ShoppingBag } from 'lucide-react'
import { Card, CardContent } from '../../components/ui/card'
import { orderService } from '../../services/orderService'

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      const data = await orderService.getAll()
      setOrders(data)
    } catch (error) {
      console.error('Error loading orders:', error)
      alert('Error loading orders. Check console for details.')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await orderService.updateStatus(orderId, newStatus)
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ))
      alert('Order status updated successfully!')
    } catch (error) {
      console.error('Error updating order:', error)
      alert('Error updating order. Check console for details.')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <ShoppingBag className="h-12 w-12 mx-auto mb-4 text-gray-400 animate-pulse" />
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Order Management</h1>
        <p className="text-gray-600 mt-1">View and manage customer orders</p>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="p-16 text-center">
            <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
            <p className="text-gray-600">Orders will appear here when customers make purchases</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <p className="font-semibold text-lg">Order #{order.id.slice(0, 8).toUpperCase()}</p>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Customer: {order.user_email || order.userEmail}
                    </p>
                    <p className="text-sm text-gray-600">
                      Date: {new Date(order.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">${order.total?.toFixed(2)}</p>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                      className="mt-2 border rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <p className="font-semibold text-sm mb-3">Order Items:</p>
                  <div className="space-y-2">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm bg-gray-50 p-3 rounded">
                        <span className="font-medium">{item.name}</span>
                        <span className="text-gray-600">
                          {item.quantity} × ${item.price} = ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
