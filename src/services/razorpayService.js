export const razorpayService = {
  // Initialize Razorpay payment
  initializePayment(amount, orderData, onSuccess, onFailure) {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: Math.round(amount * 100), // Convert to paise (smallest currency unit)
      currency: 'INR',
      name: 'Thrift Shop',
      description: 'Order Payment',
      // image: '/logo.png', // Removed to avoid CORS issues
      handler: function (response) {
        // Payment successful
        onSuccess({
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature
        })
      },
      prefill: {
        name: orderData.userName || '',
        email: orderData.user_email || '',
        contact: orderData.userPhone || ''
      },
      notes: {
        order_items: JSON.stringify(orderData.items)
      },
      theme: {
        color: '#000000' // Your brand color
      },
      modal: {
        ondismiss: function() {
          // User closed the payment modal
          onFailure(new Error('Payment cancelled by user'))
        }
      }
    }

    const razorpay = new window.Razorpay(options)
    
    razorpay.on('payment.failed', function (response) {
      // Payment failed
      onFailure({
        code: response.error.code,
        description: response.error.description,
        source: response.error.source,
        step: response.error.step,
        reason: response.error.reason,
        metadata: response.error.metadata
      })
    })

    razorpay.open()
  },

  // Verify payment (optional - for additional security)
  async verifyPayment(paymentId, orderId, signature) {
    // This should ideally be done on server-side
    // For now, we'll just return success
    // In production, implement server-side verification
    return {
      verified: true,
      paymentId,
      orderId,
      signature
    }
  }
}
