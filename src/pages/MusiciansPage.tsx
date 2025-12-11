/**
 * Musicians Page
 * Displays all musicians in the system with search, filter, and edit capabilities
 * Visible only to hosts
 */

import {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {useAuth} from '../hooks'
import {musicianService} from '../services'
import type {MusicianLevel, MusicianResponseDto} from '../types/api.types'
import {EditMusicianModal} from '../components/EditMusicianModal'
import {ErrorAlert, SuccessAlert} from '../components'

export function MusiciansPage() {
  const navigate = useNavigate()
  const { user, isLoading: authLoading } = useAuth()

  // State
  const [musicians, setMusicians] = useState<MusicianResponseDto[]>([])
  const [filteredMusicians, setFilteredMusicians] = useState<MusicianResponseDto[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLevel, setSelectedLevel] = useState<MusicianLevel | 'ALL'>('ALL')
  const [editingMusician, setEditingMusician] = useState<MusicianResponseDto | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Role guard - redirect if not host
  useEffect(() => {
    if (!authLoading && !user?.isHost) {
      navigate('/')
    }
  }, [user?.isHost, authLoading, navigate])

  // Fetch all musicians on mount
  useEffect(() => {
    const fetchMusicians = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const result = await musicianService.findAll()
        setMusicians(result.data ?? [])
        setFilteredMusicians(result.data ?? [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load musicians')
      } finally {
        setIsLoading(false)
      }
    }

    if (user?.isHost) {
      fetchMusicians()
    }
  }, [user?.isHost])

  // Apply search and filter
  useEffect(() => {
    let filtered = musicians

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (m) =>
          m.name.toLowerCase().includes(query) ||
          m.instrument.toLowerCase().includes(query) ||
          m.contact.toLowerCase().includes(query)
      )
    }

    // Apply level filter
    if (selectedLevel !== 'ALL') {
      filtered = filtered.filter((m) => m.level === selectedLevel)
    }

    setFilteredMusicians(filtered)
  }, [searchQuery, selectedLevel, musicians])

  const handleEditMusician = (musician: MusicianResponseDto) => {
    setEditingMusician(musician)
  }

  const handleUpdateMusician = async (updatedMusician: MusicianResponseDto) => {
    try {
      await musicianService.update(updatedMusician.id, {
        name: updatedMusician.name,
        instrument: updatedMusician.instrument,
        level: updatedMusician.level,
        contact: updatedMusician.contact,
      })

      // Update local state
      setMusicians((prev) =>
        prev.map((m) => (m.id === updatedMusician.id ? updatedMusician : m))
      )

      setSuccess('Musician updated successfully')
      setEditingMusician(null)

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update musician')
    }
  }

  const handleCloseEditModal = () => {
    setEditingMusician(null)
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    )
  }

  if (!user?.isHost) {
    return null
  }

  return (
    <div className="min-h-screen bg-base-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">🎵 Musicians Directory</h1>
          <p className="text-base-content/70">
            Manage and view all musicians in your system
          </p>
        </div>

        {/* Alerts */}
        {error && <ErrorAlert message={error} title="Error" />}
        {success && <SuccessAlert message={success} title="Success" />}

        {/* Search and Filter Bar */}
        <div className="card bg-base-200 mb-6">
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Search Input */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Search Musicians</span>
                </label>
                <input
                  type="text"
                  placeholder="Search by name, instrument, or contact..."
                  className="input input-bordered"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Level Filter */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Filter by Level</span>
                </label>
                <select
                  className="select select-bordered"
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value as MusicianLevel | 'ALL')}
                >
                  <option value="ALL">All Levels</option>
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                  <option value="PROFESSIONAL">Professional</option>
                </select>
              </div>
            </div>

            {/* Results count */}
            <div className="text-sm text-base-content/70 mt-4">
              Showing {filteredMusicians.length} of {musicians.length} musicians
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="loading loading-spinner loading-lg"></div>
          </div>
        ) : filteredMusicians.length === 0 ? (
          <div className="card bg-base-200">
            <div className="card-body text-center">
              <p className="text-base-content/70">
                {musicians.length === 0
                  ? 'No musicians found. Musicians will appear here once they register.'
                  : 'No musicians match your search criteria.'}
              </p>
            </div>
          </div>
        ) : (
          /* Musicians Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMusicians.map((musician) => (
              <div key={musician.id} className="card bg-base-200 shadow-lg hover:shadow-xl transition-shadow">
                <div className="card-body">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h2 className="card-title text-lg">{musician.name}</h2>
                      <p className="text-sm text-base-content/70">
                        {musician.instrument}
                      </p>
                    </div>
                    <div className="badge badge-primary">
                      {musician.level}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Contact:</span>
                      <span className="text-base-content/70">{musician.contact}</span>
                    </div>
                    {musician.phone && (
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">Phone:</span>
                        <span className="text-base-content/70">{musician.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Joined:</span>
                      <span className="text-base-content/70">
                        {new Date(musician.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="card-actions justify-end mt-4">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleEditMusician(musician)}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingMusician && (
        <EditMusicianModal
          musician={editingMusician}
          onSave={handleUpdateMusician}
          onClose={handleCloseEditModal}
        />
      )}
    </div>
  )
}

export default MusiciansPage

