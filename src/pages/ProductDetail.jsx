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
  
  // Gallery state
  const [selectedImage, setSelectedImage] = useState(null)

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
      
      // Parse colors if they're strings (for backward compatibility)
      if (currentProduct.colors && currentProduct.colors.length > 0) {
        currentProduct.colors = currentProduct.colors.map(color => {
          // If color is already an object with name and hex, use it
          if (typeof color === 'object' && color.name && color.hex) {
            return color
          }
          // If color is a string, convert it to object format
          if (typeof color === 'string') {
            return {
              name: color,
              hex: getColorHex(color)
            }
          }
          return color
        })
      }
      
      setProduct(currentProduct)
      
      // Debug: Check if gallery images exist
      console.log('Product loaded:', currentProduct.name)
      console.log('Gallery images:', currentProduct.gallery_images)
      
      // Set default image (main product image)
      setSelectedImage(currentProduct.image)
      
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

  // Helper function to get hex color from color name
  const getColorHex = (colorName) => {
    const colorMap = {
      'black': '#000000',
      'white': '#ffffff',
      'red': '#dc2626',
      'blue': '#2563eb',
      'green': '#16a34a',
      'yellow': '#fbbf24',
      'pink': '#ec4899',
      'purple': '#9333ea',
      'gray': '#6b7280',
      'brown': '#92400e',
      'navy': '#1e3a8a',
      'beige': '#d6d3d1',
      'tan': '#d97706',
      'olive': '#65a30d',
      'burgundy': '#7f1d1d',
      'cream': '#fef3c7'
    }
    return colorMap[colorName.toLowerCase()] || '#000000'
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
        {/* Product Images */}
        <div>
          {/* Check if product has gallery images */}
          {product.gallery_images && product.gallery_images.length > 0 ? (
            <div className="flex gap-4">
              {/* Thumbnail Gallery */}
              <div className="flex flex-col gap-2 w-20">
                {/* Main image thumbnail */}
                <button
                  onClick={() => setSelectedImage(product.image)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === product.image
                      ? 'border-black'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {product.image ? (
                    <img
                      src={product.image}
                      alt="Main"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                      <Package className="h-6 w-6 text-gray-400" />
                    </div>
                  )}
                </button>
                
                {/* Gallery thumbnails */}
                {product.gallery_images.map((imageUrl, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(imageUrl)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === imageUrl
                        ? 'border-black'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={imageUrl}
                      alt={`View ${index + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
              
              {/* Main Image Display */}
              <div className="flex-1 aspect-square rounded-lg overflow-hidden bg-gray-100">
                {selectedImage || product.image ? (
                  <img
                    src={selectedImage || product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="h-24 w-24 text-gray-400" />
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Single image display when no gallery */
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
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
          
          <div className="text-3xl font-bold mb-6">₹{product.price}</div>
          
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
                {product.colors.map((color) => {
                  const isSelected = selectedColor?.name === color.name
                  const isLightColor = color.hex && (
                    color.hex.toLowerCase() === '#ffffff' || 
                    color.hex.toLowerCase() === '#fafaf9' ||
                    color.hex.toLowerCase() === '#fef3c7'
                  )
                  
                  return (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color)}
                      className={`relative w-12 h-12 rounded-full transition-all ${
                        isSelected
                          ? 'ring-2 ring-black ring-offset-2 scale-110'
                          : 'ring-1 ring-gray-300 hover:ring-gray-400'
                      }`}
                      style={{ backgroundColor: color.hex || '#000000' }}
                      title={color.name}
                    >
                      {isSelected && (
                        <Check 
                          className={`absolute inset-0 m-auto h-5 w-5 drop-shadow-lg ${
                            isLightColor ? 'text-black' : 'text-white'
                          }`} 
                        />
                      )}
                    </button>
                  )
                })}
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
                    <p className="text-xl font-bold">₹{relatedProduct.price}</p>
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
