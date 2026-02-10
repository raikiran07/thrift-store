import { Shield } from 'lucide-react'

export default function AdminBadge() {
  return (
    <div className="inline-flex items-center gap-1 px-2 py-1 bg-black text-white text-xs rounded-full">
      <Shield className="h-3 w-3" />
      <span>Admin</span>
    </div>
  )
}
