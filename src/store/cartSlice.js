import { createSlice } from '@reduxjs/toolkit'

// Load cart from localStorage
const loadCartFromStorage = () => {
  try {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      return JSON.parse(savedCart)
    }
  } catch (error) {
    console.error('Error loading cart from localStorage:', error)
  }
  return { items: [], total: 0 }
}

const initialState = loadCartFromStorage()

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const itemId = action.payload.variantId || action.payload.id
      const existingItem = state.items.find(item => (item.variantId || item.id) === itemId)
      if (existingItem) {
        existingItem.quantity += 1
      } else {
        state.items.push({ ...action.payload, quantity: 1 })
      }
      state.total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      
      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(state))
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => (item.variantId || item.id) !== action.payload)
      state.total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      
      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(state))
    },
    updateQuantity: (state, action) => {
      const item = state.items.find(item => (item.variantId || item.id) === action.payload.id)
      if (item) {
        item.quantity = action.payload.quantity
        state.total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      }
      
      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(state))
    },
    clearCart: (state) => {
      state.items = []
      state.total = 0
      
      // Clear from localStorage
      localStorage.removeItem('cart')
    },
  },
})

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions
export default cartSlice.reducer
