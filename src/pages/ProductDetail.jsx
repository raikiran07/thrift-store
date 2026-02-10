import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { ArrowLeft, ShoppingCart, Package, Check } from 'lucide-react'
import { Card, CardContent } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { productService } from '../services/productService'
import { addToCart } from '../store/cartSlice'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector((state) => state.auth)
  
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [addedToCart, setAddedToCart] = useState(false)
  
  // Selected variants
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState(null)

  useEffect(() => {
    loadProduct()
  }, [id])

  const loadProduct = async () => {
    try {
      const allProducts = await productService.getAll()
      const currentProduct = allProducts.find(p => p.id === id)
      
      if (!currentProduct) {
        navigate('/')
        return
      }
      
      setProduct(currentProduct)
      
      // Set default selections
      if (currentProduct.sizes && currentProduct.sizes.length > 0) {
        setSelectedSize(currentProduct.sizes[0])
      }
      if (currentProduct.colors && currentProduct.colors.length > 0) {
        setSelectedColor(currentProduct.colors[0])
      }
      
      // Get related products
      const related = allProducts
        .filter(p => p.id !== id)
        .slice(0, 4)
      setRelatedProducts(related)
    } catch (error) {
      console.error('Error loading product:', error)
      alert('Error loading product')
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    
    // Add product with selected variants
    const productWithVariants = {
      ...product,
      selectedSize,
      selectedColor: selectedColor?.name,
      variantId: `${product.id}-${selectedSize}-${selectedColor?.name}` // Unique ID for cart item
    }
    
    dispatch(addToCart(productWithVariants))
    setAddedToCart(true)
    
    setTimeout(() => setAddedToCart(false), 2000)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Package className="h-12 w-12 text-gray-400 animate-pulse" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <Button onClick={() => navigate('/')}>Back to Shop</Button>
      </div>
    )
  }

  const hasVariants = (product.sizes && product.sizes.length > 0) || (product.colors && product.colors.length > 0)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Button
        variant="ghost"
        onClick={() => navigate('/')}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Shop
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Product Image */}
        <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="h-24 w-24 text-gray-400" />
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
          
          <div className="text-3xl font-bold mb-6">${product.price}</div>
          
          {/* Size Selector */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-3">Select Size</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border-2 rounded-md font-medium transition-all ${
                      selectedSize === size
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Color Selector */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-3">
                Select Color
                {selectedColor && <span className="text-gray-600 font-normal ml-2">- {selectedColor.name}</span>}
              </h3>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color)}
                    className={`relative w-10 h-10 rounded-full border-2 transition-all ${
                      selectedColor?.name === color.name
                        ? 'border-black scale-110'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  >
                    {selectedColor?.name === color.name && (
                      <Check className="absolute inset-0 m-auto h-5 w-5 text-white drop-shadow-lg" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div className="mb-8">
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-gray-600 leading-relaxed">
              {product.description || 'A unique vintage piece perfect for your collection. This item has been carefully selected and is in excellent condition.'}
            </p>
          </div>

          <div className="mb-8">
            <h3 className="font-semibold mb-2">Details</h3>
            <ul className="space-y-2 text-gray-600">
              <li>• Vintage item</li>
              <li>• One of a kind</li>
              <li>• Carefully curated</li>
              <li>• Excellent condition</li>
              {hasVariants && <li>• Multiple sizes and colors available</li>}
            </ul>
          </div>

          <div className="flex gap-4 mt-auto">
            <Button
              onClick={handleAddToCart}
              size="lg"
              className="flex-1"
              disabled={addedToCart}
            >
              {addedToCart ? (
                <>✓ Added to Cart</>
              ) : (
                <>
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/cart')}
            >
              View Cart
            </Button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Link
                key={relatedProduct.id}
                to={`/product/${relatedProduct.id}`}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  {relatedProduct.image ? (
                    <img
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      className="w-full h-64 object-cover"
                    />
                  ) : (
                    <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
                      <Package className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2 line-clamp-1">
                      {relatedProduct.name}
                    </h3>
                    <p className="text-xl font-bold">${relatedProduct.price}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
