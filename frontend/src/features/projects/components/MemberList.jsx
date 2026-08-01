import { useState, useCallback } from 'react'
import { UserMinus, UserPlus, Search } from 'lucide-react'
import { useAuth } from '@/app/AuthContext'
import { useRemoveMembers, useAddMembers } from '../hooks/useProjects'
import { useAllUsers } from '@/features/admin/hooks/useAdmin'
import { Button } from '@/shared/components/Button'
import { Modal } from '@/shared/components/Modal'
import { ConfirmDialog } from '@/shared/components/ConfirmDialog'
import { Spinner } from '@/shared/components/Spinner'
import { ErrorMessage } from '@/shared/components/FormField'
import { getInitials, extractApiError } from '@/shared/lib/utils'

function Avatar({ name }) {
  return (
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500/40 to-violet-600/40 border border-brand-600/30 flex items-center justify-center text-xs font-bold text-brand-300 flex-shrink-0">
      {getInitials(name)}
    </div>
  )
}

export function MemberList({ project }) {
  const { isAdmin } = useAuth()
  const [addOpen, setAddOpen] = useState(false)
  const [removingId, setRemovingId] = useState(null)

  const { mutate: remove, isPending: removing, error: removeError } = useRemoveMembers(project.id, project.slug)

  const handleRemove = useCallback((userId) => {
    remove([userId], { onSuccess: () => setRemovingId(null) })
  }, [remove])

  const members = project.members ?? []

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
          Members ({members.length})
        </h3>
        {isAdmin && (
          <Button size="sm" onClick={() => setAddOpen(true)} variant="outline">
            <UserPlus className="w-3.5 h-3.5" /> Add Member
          </Button>
        )}
      </div>

      <ErrorMessage message={removeError ? extractApiError(removeError) : null} />

      <div className="space-y-2">
        {members.length === 0 && (
          <p className="text-sm text-slate-500 italic">No members yet.</p>
        )}
        {members.map(({ user }) => (
          <div key={user.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-surface-700/50 transition-colors group">
            <Avatar name={user.name} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-200 truncate">{user.name}</p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>
            {isAdmin && (
              <button
                onClick={() => setRemovingId(user.id)}
                disabled={removing && removingId === user.id}
                className="p-1.5 rounded-lg text-slate-600 hover:text-rose-400 hover:bg-rose-900/20 opacity-0 group-hover:opacity-100 transition-all"
                title="Remove member"
              >
                {removing && removingId === user.id
                  ? <Spinner size="sm" />
                  : <UserMinus className="w-3.5 h-3.5" />
                }
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Add member modal */}
      <AddMemberModal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        project={project}
        existingMemberIds={members.map((m) => m.user.id)}
      />

      {/* Remove confirm dialog */}
      <ConfirmDialog
        isOpen={!!removingId && !removing}
        onClose={() => setRemovingId(null)}
        onConfirm={() => handleRemove(removingId)}
        isLoading={removing}
        title="Remove member?"
        description="This member will lose access to the project and its tasks."
        confirmLabel="Remove"
      />
    </div>
  )
}

function AddMemberModal({ isOpen, onClose, project, existingMemberIds }) {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState([])
  const { data, isLoading } = useAllUsers({ search, limit: 20 })
  const { mutate: addMembers, isPending, error } = useAddMembers(project.id, project.slug)

  const users = data?.data?.data ?? []
  const eligible = users.filter((u) => !existingMemberIds.includes(u.id))

  const toggle = useCallback((id) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])
  }, [])

  const handleAdd = () => {
    if (selected.length === 0) return
    addMembers(selected, {
      onSuccess: () => {
        setSelected([])
        setSearch('')
        onClose()
      },
    })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Members" size="md">
      <div className="space-y-4">
        <ErrorMessage message={error ? extractApiError(error) : null} />

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users by name or email..."
            className="input-base pl-9"
          />
        </div>

        {/* Users list */}
        <div className="space-y-1 max-h-64 overflow-y-auto">
          {isLoading && (
            <div className="flex justify-center py-4">
              <Spinner />
            </div>
          )}
          {!isLoading && eligible.length === 0 && (
            <p className="text-sm text-slate-500 text-center py-4">
              {search ? 'No users found' : 'All approved users are already members'}
            </p>
          )}
          {eligible.map((user) => {
            const isSelected = selected.includes(user.id)
            return (
              <button
                key={user.id}
                onClick={() => toggle(user.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                  isSelected
                    ? 'bg-brand-600/20 border border-brand-600/30'
                    : 'hover:bg-surface-700'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500/30 to-violet-600/30 flex items-center justify-center text-xs font-bold text-brand-300 flex-shrink-0">
                  {getInitials(user.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-200 truncate">{user.name}</p>
                  <p className="text-xs text-slate-500 truncate">{user.email}</p>
                </div>
                {isSelected && (
                  <div className="w-4 h-4 rounded-full bg-brand-500 flex items-center justify-center flex-shrink-0">
                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>
            )
          })}
        </div>

        <div className="flex gap-3 pt-2 border-t border-surface-700">
          <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button
            className="flex-1"
            onClick={handleAdd}
            isLoading={isPending}
            disabled={selected.length === 0}
          >
            Add {selected.length > 0 ? `(${selected.length})` : ''} Members
          </Button>
        </div>
      </div>
    </Modal>
  )
}
