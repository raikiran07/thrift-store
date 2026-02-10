import { supabase } from '../lib/supabase'

export const orderService = {
  async getAll() {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async create(orderData) {
    const { data, error } = await supabase
      .from('orders')
      .insert([{
        ...orderData,
        status: 'pending'
      }])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updateStatus(id, status) {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}
