import { useSelector, useDispatch } from 'react-redux'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { ShoppingCart, LogOut, Package, ShoppingBag, Shield, History } from 'lucide-react'
import { Button } from './ui/button'
import { logout } from '../store/authSlice'
import { authService } from '../services/authService'

export default function Navbar() {
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const { isAdmin, loading } = useSelector((state) => state.admin)
  const { items } = useSelector((state) => state.cart)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    await authService.signOut()
    dispatch(logout())
    navigate('/')
  }

  const isActivePath = (path) => {
    return location.pathname === path
  }

  return (
    <nav className="border-b bg-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-2xl font-bold">Thrift</Link>
            
            {/* Admin Navigation - Only visible to admins */}
            {isAuthenticated && isAdmin && (
              <div className="hidden md:flex items-center gap-1">
                <Link to="/admin/products">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className={isActivePath('/admin/products') ? 'bg-gray-100' : ''}
                  >
                    <Package className="h-4 w-4 mr-2" />
                    Products
                  </Button>
                </Link>
                <Link to="/admin/orders">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className={isActivePath('/admin/orders') ? 'bg-gray-100' : ''}
                  >
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Orders
                  </Button>
                </Link>
                <Link to="/admin/admins">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className={isActivePath('/admin/admins') ? 'bg-gray-100' : ''}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Admins
                  </Button>
                </Link>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm hidden sm:inline">
                  Hi, {user?.name}
                  {isAdmin && <span className="ml-1 text-xs text-gray-500">(Admin)</span>}
                </span>
                <Link to="/orders">
                  <Button variant="ghost" size="sm" title="My Orders">
                    <History className="h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/cart" className="relative">
                  <ShoppingCart className="h-6 w-6" />
                  {items.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {items.length}
                    </span>
                  )}
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button size="sm">Login</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
