import { useState } from 'react'
import { Shield, Users, Clock, Search, CheckCircle, XCircle, RefreshCw } from 'lucide-react'
import { useAllUsers, usePendingUsers, useApproveUser, useToggleActive } from '../hooks/useAdmin'
import { Button } from '@/shared/components/Button'
import { TableRowSkeleton } from '@/shared/components/Skeleton'
import { ErrorMessage } from '@/shared/components/FormField'
import { extractApiError, getInitials, formatDate } from '@/shared/lib/utils'

const tabs = [
  { id: 'all', label: 'All Users', icon: Users },
  { id: 'pending', label: 'Pending Approval', icon: Clock },
]

export default function AdminPage() {
  const [tab, setTab] = useState('all')
  const [search, setSearch] = useState('')

  const allUsersQuery = useAllUsers({ search: search || undefined, limit: 50 })
  const pendingQuery = usePendingUsers({ search: search || undefined, limit: 50 })

  const { mutate: approve, isPending: approving } = useApproveUser()
  const { mutate: toggleActive, isPending: togglingActive } = useToggleActive()

  const query = tab === 'all' ? allUsersQuery : pendingQuery
  const { data, isLoading, isError, error } = query
  const users = data?.data?.data ?? []

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-slate-100 flex items-center gap-2">
          <Shield className="w-6 h-6 text-violet-400" />
          Admin Panel
        </h1>
        <p className="text-slate-400 text-sm mt-1">Manage users — approve accounts and toggle access</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-surface-800 rounded-xl w-fit border border-surface-700">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === id
                ? 'bg-brand-600/20 text-brand-300 border border-brand-600/30'
                : 'text-slate-400 hover:text-slate-100'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
            {id === 'pending' && pendingQuery.data?.data?.data?.length > 0 && (
              <span className="bg-rose-600 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                {pendingQuery.data.data.data.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users..."
          className="input-base pl-9"
        />
      </div>

      {/* Error */}
      {isError && <ErrorMessage message={extractApiError(error)} />}

      {/* Table — scrollable on mobile */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-700">
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">User</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap hidden sm:table-cell">Email</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap hidden md:table-cell">Joined</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">Status</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} cols={5} />)}

              {!isLoading && users.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-500">
                    {tab === 'pending' ? '🎉 No pending approvals' : 'No users found'}
                  </td>
                </tr>
              )}

              {users.map((user) => (
                <tr key={user.id} className="border-b border-surface-700/50 hover:bg-surface-700/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500/30 to-violet-600/30 flex items-center justify-center text-xs font-bold text-brand-300 flex-shrink-0">
                        {getInitials(user.name)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-slate-200 truncate">{user.name}</p>
                        <p className="text-xs text-slate-500 sm:hidden truncate">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-400 hidden sm:table-cell">{user.email}</td>
                  <td className="px-4 py-3 text-slate-400 hidden md:table-cell text-xs">{formatDate(user.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${
                        user.approved
                          ? 'bg-emerald-900/30 text-emerald-300 border-emerald-700/40'
                          : 'bg-amber-900/30 text-amber-300 border-amber-700/40'
                      }`}>
                        {user.approved ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {user.approved ? 'Approved' : 'Pending'}
                      </span>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                        user.active
                          ? 'bg-sky-900/30 text-sky-300 border-sky-700/40'
                          : 'bg-rose-900/30 text-rose-300 border-rose-700/40'
                      }`}>
                        {user.active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2 flex-wrap">
                      {!user.approved && (
                        <Button
                          size="sm"
                          variant="success"
                          isLoading={approving}
                          onClick={() => approve(user.id)}
                          className="text-xs"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Approve
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant={user.active ? 'danger' : 'outline'}
                        isLoading={togglingActive}
                        onClick={() => toggleActive(user.id)}
                        className="text-xs"
                      >
                        {user.active
                          ? <><XCircle className="w-3.5 h-3.5" /> Deactivate</>
                          : <><RefreshCw className="w-3.5 h-3.5" /> Activate</>
                        }
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
