import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Button } from '../ui/button'
import { X, Plus } from 'lucide-react'
import { productService } from '../../services/productService'

export default function ProductForm({ product, onClose }) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    price: product?.price || '',
    image: product?.image || '',
    description: product?.description || '',
    sizes: product?.sizes || [],
    colors: product?.colors || []
  })
  const [imageFile, setImageFile] = useState(null)
  const [imageSource, setImageSource] = useState('upload')
  const [loading, setLoading] = useState(false)
  
  // New size/color inputs
  const [newSize, setNewSize] = useState('')
  const [newColorName, setNewColorName] = useState('')
  const [newColorHex, setNewColorHex] = useState('#000000')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (product) {
        await productService.update(product.id, formData, imageFile)
      } else {
        await productService.create(formData, imageFile)
      }
      onClose()
    } catch (error) {
      console.error('Error saving product:', error)
      alert('Error saving product')
    } finally {
      setLoading(false)
    }
  }

  const addSize = () => {
    if (newSize && !formData.sizes.includes(newSize)) {
      setFormData({ ...formData, sizes: [...formData.sizes, newSize] })
      setNewSize('')
    }
  }

  const removeSize = (size) => {
    setFormData({ ...formData, sizes: formData.sizes.filter(s => s !== size) })
  }

  const addColor = () => {
    if (newColorName && !formData.colors.find(c => c.name === newColorName)) {
      setFormData({ 
        ...formData, 
        colors: [...formData.colors, { name: newColorName, hex: newColorHex }] 
      })
      setNewColorName('')
      setNewColorHex('#000000')
    }
  }

  const removeColor = (colorName) => {
    setFormData({ ...formData, colors: formData.colors.filter(c => c.name !== colorName) })
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{product ? 'Edit Product' : 'Add New Product'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price ($)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full min-h-[100px] border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Describe the product..."
            />
          </div>

          {/* Sizes */}
          <div className="space-y-2">
            <Label>Available Sizes</Label>
            <div className="flex gap-2">
              <Input
                value={newSize}
                onChange={(e) => setNewSize(e.target.value.toUpperCase())}
                placeholder="e.g., S, M, L, XL"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSize())}
              />
              <Button type="button" onClick={addSize} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.sizes.map((size) => (
                <span
                  key={size}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm"
                >
                  {size}
                  <button
                    type="button"
                    onClick={() => removeSize(size)}
                    className="hover:text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div className="space-y-2">
            <Label>Available Colors</Label>
            <div className="flex gap-2">
              <Input
                value={newColorName}
                onChange={(e) => setNewColorName(e.target.value)}
                placeholder="Color name (e.g., Black)"
                className="flex-1"
              />
              <input
                type="color"
                value={newColorHex}
                onChange={(e) => setNewColorHex(e.target.value)}
                className="w-12 h-10 rounded border cursor-pointer"
              />
              <Button type="button" onClick={addColor} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.colors.map((color) => (
                <span
                  key={color.name}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full text-sm"
                >
                  <span
                    className="w-4 h-4 rounded-full border"
                    style={{ backgroundColor: color.hex }}
                  />
                  {color.name}
                  <button
                    type="button"
                    onClick={() => removeColor(color.name)}
                    className="hover:text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Product Image</Label>
            <div className="flex gap-4 mb-3">
              <button
                type="button"
                onClick={() => setImageSource('upload')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  imageSource === 'upload'
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Upload File
              </button>
              <button
                type="button"
                onClick={() => setImageSource('url')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  imageSource === 'url'
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Use URL
              </button>
            </div>

            {imageSource === 'upload' ? (
              <>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                />
                {formData.image && !imageFile && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 mb-2">Current image:</p>
                    <img src={formData.image} alt="Current" className="w-32 h-32 object-cover rounded" />
                  </div>
                )}
              </>
            ) : (
              <>
                <Input
                  id="imageUrl"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                />
                <p className="text-xs text-gray-500">
                  💡 Paste any image URL (Unsplash, Imgur, etc.)
                </p>
                {formData.image && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 mb-2">Preview:</p>
                    <img 
                      src={formData.image} 
                      alt="Preview" 
                      className="w-32 h-32 object-cover rounded"
                      onError={(e) => {
                        e.target.style.display = 'none'
                      }}
                    />
                  </div>
                )}
              </>
            )}
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Product'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
