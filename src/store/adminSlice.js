import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isAdmin: false,
  loading: true,
}

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setAdmin: (state, action) => {
      state.isAdmin = action.payload
      state.loading = false
    },
    clearAdmin: (state) => {
      state.isAdmin = false
      state.loading = false
    },
  },
})

export const { setAdmin, clearAdmin } = adminSlice.actions
export default adminSlice.reducer
