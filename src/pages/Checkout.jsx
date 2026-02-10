import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { clearCart } from '../store/cartSlice'
import { orderService } from '../services/orderService'
import { razorpayService } from '../services/razorpayService'

export default function Checkout() {
  const { items, total } = useSelector((state) => state.cart)
  const { user } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart')
    }
  }, [items, navigate])

  const handleRazorpayPayment = () => {
    // Check if Razorpay is loaded
    if (!window.Razorpay) {
      alert('Payment gateway not loaded. Please refresh the page.')
      return
    }

    const orderData = {
      items,
      total,
      user_email: user?.email || 'guest@example.com',
      userName: user?.user_metadata?.name || 'Guest User'
    }

    razorpayService.initializePayment(
      total,
      orderData,
      async (paymentResponse) => {
        // Payment successful - create order in database
        try {
          // Create order data without Razorpay fields first
          const orderToCreate = {
            items,
            total,
            user_email: user?.email || 'guest@example.com',
            status: 'pending'
          }
          
          // Only add Razorpay fields if they exist in the response
          if (paymentResponse.razorpay_payment_id) {
            orderToCreate.razorpay_payment_id = paymentResponse.razorpay_payment_id
          }
          if (paymentResponse.razorpay_order_id) {
            orderToCreate.razorpay_order_id = paymentResponse.razorpay_order_id
          }

          await orderService.create(orderToCreate)

          alert('Payment successful! Order placed.')
          dispatch(clearCart())
          navigate('/orders')
        } catch (error) {
          console.error('Error creating order:', error)
          
          // If error is about missing columns, try without Razorpay fields
          if (error.message && error.message.includes('razorpay')) {
            try {
              await orderService.create({
                items,
                total,
                user_email: user?.email || 'guest@example.com',
                status: 'pending'
              })
              
              alert('Payment successful! Order placed.')
              dispatch(clearCart())
              navigate('/orders')
              return
            } catch (retryError) {
              console.error('Retry error:', retryError)
            }
          }
          
          alert('Payment successful but error saving order. Please contact support with payment ID: ' + paymentResponse.razorpay_payment_id)
        }
      },
      (error) => {
        // Payment failed or cancelled
        console.error('Payment error:', error)
        if (error.message === 'Payment cancelled by user') {
          alert('Payment cancelled')
        } else {
          alert('Payment failed: ' + (error.description || 'Please try again'))
        }
      }
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span>{item.name} x {item.quantity}</span>
                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Button 
              onClick={handleRazorpayPayment}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Pay ₹{total.toFixed(2)} with Razorpay
            </Button>
            <p className="text-xs text-gray-500 text-center">
              Supports UPI, Cards, Netbanking, and Wallets
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
