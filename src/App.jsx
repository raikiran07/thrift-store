import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import Login from './pages/Login'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Orders from './pages/Orders'
import AdminDashboard from './pages/admin/AdminDashboard'
import Products from './pages/admin/Products'
import AdminOrders from './pages/admin/Orders'
import Admins from './pages/admin/Admins'
import { login, logout } from './store/authSlice'
import { setAdmin, clearAdmin } from './store/adminSlice'
import { authService } from './services/authService'
import { adminService } from './services/adminService'

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useSelector((state) => state.auth)
  return isAuthenticated ? children : <Navigate to="/login" />
}

function AdminRoute({ children }) {
  const { isAuthenticated } = useSelector((state) => state.auth)
  const { isAdmin, loading } = useSelector((state) => state.admin)
  
  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  if (!isAuthenticated) return <Navigate to="/login" />
  if (!isAdmin) return <Navigate to="/" />
  
  return children
}

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    // Check for existing session
    authService.getCurrentUser().then(async user => {
      if (user) {
        dispatch(login({
          name: user.email.split('@')[0],
          email: user.email,
          id: user.id
        }))
        
        // Check if user is admin
        const isAdmin = await adminService.isAdmin(user.id)
        dispatch(setAdmin(isAdmin))
      } else {
        dispatch(clearAdmin())
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = authService.onAuthStateChange(async (user) => {
      if (user) {
        dispatch(login({
          name: user.email.split('@')[0],
          email: user.email,
          id: user.id
        }))
        
        // Check if user is admin
        const isAdmin = await adminService.isAdmin(user.id)
        dispatch(setAdmin(isAdmin))
      } else {
        dispatch(logout())
        dispatch(clearAdmin())
      }
    })

    return () => subscription.unsubscribe()
  }, [dispatch])

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>}>
          <Route index element={<Navigate to="/admin/products" />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="admins" element={<Admins />} />
        </Route>

        {/* Customer Routes */}
        <Route path="/*" element={
          <>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
              <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
              <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
            </Routes>
          </>
        } />
      </Routes>
    </div>
  )
}

export default App
