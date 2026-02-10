import { supabase } from '../lib/supabase'

export const adminService = {
  async isAdmin(userId) {
    if (!userId) {
      console.log('❌ adminService.isAdmin - No userId provided')
      return false
    }
    
    console.log('🔍 adminService.isAdmin - Checking user:', userId)
    
    try {
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle()
      
      console.log('📋 Query result:', { data, error })
      
      if (error) {
        console.log('❌ Admin check error:', error)
        return false
      }
      
      const isAdmin = data !== null
      console.log(isAdmin ? '✅ User IS admin!' : '❌ User is NOT admin', { data, userId })
      
      return isAdmin
    } catch (err) {
      console.error('💥 Exception in isAdmin:', err)
      return false
    }
  },

  async getCurrentUserIsAdmin() {
    const { data: { user } } = await supabase.auth.getUser()
    console.log('👤 Current user:', user)
    
    if (!user) {
      console.log('❌ No user logged in')
      return false
    }
    
    return await this.isAdmin(user.id)
  },

  async getAllAdmins() {
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async getAllUsers() {
    // Get all users from Supabase Auth using the admin API
    // Note: This requires the service_role key, so we'll use a workaround
    // We'll get users who have placed orders or are admins
    
    try {
      // Get all unique user emails from orders and admins
      const { data: orders } = await supabase
        .from('orders')
        .select('user_email, created_at')
      
      const { data: admins } = await supabase
        .from('admins')
        .select('user_id, email, created_at')
      
      // Get current user
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      
      // Combine and deduplicate
      const usersMap = new Map()
      
      // Add current user
      if (currentUser) {
        usersMap.set(currentUser.id, {
          id: currentUser.id,
          email: currentUser.email,
          created_at: currentUser.created_at
        })
      }
      
      // Add admins
      if (admins) {
        admins.forEach(admin => {
          usersMap.set(admin.user_id, {
            id: admin.user_id,
            email: admin.email,
            created_at: admin.created_at
          })
        })
      }
      
      // Add users from orders (we only have emails, not IDs)
      // We'll need to match them with admins or current user
      
      return Array.from(usersMap.values()).sort((a, b) => 
        new Date(b.created_at) - new Date(a.created_at)
      )
    } catch (error) {
      console.error('Error getting users:', error)
      throw error
    }
  },

  async addAdmin(userEmail) {
    // Since we can't easily get user_id from email without admin access,
    // we'll need the user to be logged in or we need their ID
    // For now, let's accept email and try to find the user
    
    const { data: existingAdmin } = await supabase
      .from('admins')
      .select('*')
      .eq('email', userEmail)
      .maybeSingle()
    
    if (existingAdmin) {
      throw new Error('User is already an admin')
    }
    
    // We need to get the user_id somehow
    // The best way is to have them sign in first, then we can get their ID
    // For now, we'll just insert with email and let the trigger handle it
    
    const { data, error } = await supabase
      .from('admins')
      .insert([{ email: userEmail }])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async removeAdmin(userId) {
    const { error } = await supabase
      .from('admins')
      .delete()
      .eq('user_id', userId)
    
    if (error) throw error
  }
}
