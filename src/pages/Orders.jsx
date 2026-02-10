import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Package, Clock, Truck, CheckCircle, XCircle } from 'lucide-react'
import { Card, CardContent } from '../components/ui/card'
import { orderService } from '../services/orderService'

const statusConfig = {
  pending: {
    icon: Clock,
    color: 'text-yellow-600',
    bg: 'bg-yellow-50',
    label: 'Pending',
    description: 'Your order is being processed'
  },
  processing: {
    icon: Package,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    label: 'Processing',
    description: 'We are preparing your order'
  },
  shipped: {
    icon: Truck,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    label: 'Shipped',
    description: 'Your order is on the way'
  },
  delivered: {
    icon: CheckCircle,
    color: 'text-green-600',
    bg: 'bg-green-50',
    label: 'Delivered',
    description: 'Order has been delivered'
  },
  cancelled: {
    icon: XCircle,
    color: 'text-red-600',
    bg: 'bg-red-50',
    label: 'Cancelled',
    description: 'Order was cancelled'
  }
}

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useSelector((state) => state.auth)
  const navigate = useNavigate()

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    try {
      const allOrders = await orderService.getAll()
      // Filter orders for current user
      const userOrders = allOrders.filter(
        order => order.user_email === user?.email || order.userEmail === user?.email
      )
      setOrders(userOrders)
    } catch (error) {
      console.error('Error loading orders:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <Package className="h-12 w-12 mx-auto mb-4 text-gray-400 animate-pulse" />
        <p className="text-gray-600">Loading your orders...</p>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <Package className="h-16 w-16 mx-auto mb-4 text-gray-400" />
        <h2 className="text-2xl font-bold mb-2">No orders yet</h2>
        <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800"
        >
          Start Shopping
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      <div className="space-y-6">
        {orders.map((order) => {
          const status = statusConfig[order.status] || statusConfig.pending
          const StatusIcon = status.icon

          return (
            <Card key={order.id} className="overflow-hidden">
              <CardContent className="p-0">
                {/* Order Header */}
                <div className={`${status.bg} p-4 border-b`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <StatusIcon className={`h-6 w-6 ${status.color}`} />
                      <div>
                        <p className={`font-semibold ${status.color}`}>
                          {status.label}
                        </p>
                        <p className="text-sm text-gray-600">
                          {status.description}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Order ID</p>
                      <p className="font-mono text-sm font-semibold">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Order Details */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <p className="text-sm text-gray-600">Order Date</p>
                      <p className="font-semibold">
                        {new Date(order.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="text-2xl font-bold">
                        ₹{order.total?.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div>
                    <p className="font-semibold mb-3">Items ({order.items?.length || 0})</p>
                    <div className="space-y-3">
                      {order.items?.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                        >
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                          )}
                          <div className="flex-1">
                            <p className="font-medium">{item.name}</p>
                            <div className="flex gap-3 text-sm text-gray-600">
                              <span>Qty: {item.quantity}</span>
                              {item.selectedSize && (
                                <span>Size: {item.selectedSize}</span>
                              )}
                              {item.selectedColor && (
                                <span>Color: {item.selectedColor}</span>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Timeline */}
                  <div className="mt-6 pt-6 border-t">
                    <p className="font-semibold mb-4">Order Timeline</p>
                    <div className="relative">
                      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
                      
                      {['pending', 'processing', 'shipped', 'delivered'].map((step, idx) => {
                        const stepConfig = statusConfig[step]
                        const StepIcon = stepConfig.icon
                        const isCompleted = ['pending', 'processing', 'shipped', 'delivered'].indexOf(order.status) >= idx
                        const isCurrent = order.status === step
                        const isCancelled = order.status === 'cancelled'

                        if (isCancelled && step !== 'pending') return null

                        return (
                          <div key={step} className="relative flex items-center gap-4 mb-4 last:mb-0">
                            <div
                              className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center ${
                                isCompleted || isCurrent
                                  ? `${stepConfig.bg} ${stepConfig.color}`
                                  : 'bg-gray-100 text-gray-400'
                              }`}
                            >
                              <StepIcon className="h-4 w-4" />
                            </div>
                            <div className="flex-1">
                              <p className={`font-medium ${
                                isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-400'
                              }`}>
                                {stepConfig.label}
                              </p>
                              {isCurrent && (
                                <p className="text-sm text-gray-600">
                                  {stepConfig.description}
                                </p>
                              )}
                            </div>
                          </div>
                        )
                      })}

                      {order.status === 'cancelled' && (
                        <div className="relative flex items-center gap-4">
                          <div className="relative z-10 w-8 h-8 rounded-full flex items-center justify-center bg-red-50 text-red-600">
                            <XCircle className="h-4 w-4" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">Cancelled</p>
                            <p className="text-sm text-gray-600">Order was cancelled</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
