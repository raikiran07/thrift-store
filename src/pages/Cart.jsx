import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { removeFromCart, updateQuantity } from '../store/cartSlice'

export default function Cart() {
  const { items, total } = useSelector((state) => state.cart)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Button onClick={() => navigate('/')}>Continue Shopping</Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
      
      <div className="space-y-4 mb-8">
        {items.map((item) => (
          <Card key={item.variantId || item.id}>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-gray-600">₹{item.price}</p>
                  {/* Show selected variants */}
                  {(item.selectedSize || item.selectedColor) && (
                    <div className="flex gap-3 mt-1 text-sm text-gray-600">
                      {item.selectedSize && (
                        <span className="px-2 py-0.5 bg-gray-100 rounded">
                          Size: {item.selectedSize}
                        </span>
                      )}
                      {item.selectedColor && (
                        <span className="px-2 py-0.5 bg-gray-100 rounded">
                          Color: {item.selectedColor}
                        </span>
                      )}
                    </div>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => dispatch(updateQuantity({ id: item.variantId || item.id, quantity: Math.max(1, item.quantity - 1) }))}
                    >
                      -
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => dispatch(updateQuantity({ id: item.variantId || item.id, quantity: item.quantity + 1 }))}
                    >
                      +
                    </Button>
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => dispatch(removeFromCart(item.variantId || item.id))}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <span className="font-bold">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xl font-semibold">Total</span>
            <span className="text-2xl font-bold">₹{total.toFixed(2)}</span>
          </div>
          <Button className="w-full" onClick={() => navigate('/checkout')}>
            Proceed to Checkout
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
