import { useState, useEffect } from 'react'
import { Shield, UserPlus, Trash2, Mail } from 'lucide-react'
import { Card, CardContent } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { adminService } from '../../services/adminService'

export default function Admins() {
  const [admins, setAdmins] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newAdminEmail, setNewAdminEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadAdmins()
  }, [])

  const loadAdmins = async () => {
    try {
      const adminsData = await adminService.getAllAdmins()
      setAdmins(adminsData)
    } catch (error) {
      console.error('Error loading admins:', error)
      alert('Error loading admins. Check console for details.')
    } finally {
      setLoading(false)
    }
  }

  const handleAddAdmin = async (e) => {
    e.preventDefault()
    if (!newAdminEmail) {
      alert('Please enter an email address')
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(newAdminEmail)) {
      alert('Please enter a valid email address')
      return
    }

    setSubmitting(true)
    try {
      await adminService.addAdmin(newAdminEmail)
      alert('Admin added successfully! They need to sign up with this email first.')
      setShowAddForm(false)
      setNewAdminEmail('')
      loadAdmins()
    } catch (error) {
      console.error('Error adding admin:', error)
      alert(error.message || 'Error adding admin. Make sure the user has signed up first.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleRemoveAdmin = async (userId, email) => {
    if (!confirm(`Remove admin access for ${email}?\n\nThey will lose access to the admin panel but keep their account.`)) return

    try {
      await adminService.removeAdmin(userId)
      alert('Admin removed successfully!')
      loadAdmins()
    } catch (error) {
      console.error('Error removing admin:', error)
      alert('Error removing admin. Check console for details.')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <Shield className="h-12 w-12 mx-auto mb-4 text-gray-400 animate-pulse" />
          <p className="text-gray-600">Loading admins...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Management</h1>
          <p className="text-gray-600 mt-1">Manage who has admin access to the dashboard</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)} size="lg">
          <UserPlus className="mr-2 h-4 w-4" />
          Add Admin
        </Button>
      </div>

      {/* Add Admin Form */}
      {showAddForm && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <form onSubmit={handleAddAdmin}>
              <h3 className="text-lg font-semibold mb-4">Add New Admin</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">User Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="user@example.com"
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    className="mt-1"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    💡 The user must have already signed up with this email address
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={submitting || !newAdminEmail}>
                    {submitting ? 'Adding...' : 'Add Admin'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowAddForm(false)
                      setNewAdminEmail('')
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Admins List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Current Admins ({admins.length})</h2>
        
        {admins.length === 0 ? (
          <Card>
            <CardContent className="p-16 text-center">
              <Shield className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold mb-2">No admins found</h3>
              <p className="text-gray-600">This shouldn't happen - you should be an admin!</p>
            </CardContent>
          </Card>
        ) : (
          admins.map((admin) => (
            <Card key={admin.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center">
                      <Shield className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-semibold text-lg">{admin.email}</p>
                      <p className="text-sm text-gray-600">
                        Admin since {new Date(admin.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveAdmin(admin.user_id, admin.email)}
                    disabled={admins.length === 1}
                    title={admins.length === 1 ? "Can't remove the last admin" : "Remove admin access"}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Instructions */}
      <Card className="mt-8 bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <Mail className="h-5 w-5" />
            How to Add Admins
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
            <li>User must first sign up at <code className="bg-white px-2 py-1 rounded">/login</code></li>
            <li>Enter their email address in the form above</li>
            <li>Click "Add Admin" - they'll immediately get admin access</li>
            <li>They can now access the admin panel</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  )
}
