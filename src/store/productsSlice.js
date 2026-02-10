import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [
    { id: 1, name: 'Vintage Denim Jacket', price: 45, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400' },
    { id: 2, name: 'Retro Sunglasses', price: 15, image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400' },
    { id: 3, name: 'Leather Boots', price: 65, image: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=400' },
    { id: 4, name: 'Wool Sweater', price: 35, image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400' },
    { id: 5, name: 'Canvas Tote Bag', price: 20, image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400' },
    { id: 6, name: 'Silk Scarf', price: 25, image: 'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=400' },
  ],
}

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
})

export default productsSlice.reducer
