/**
 * Host Dashboard Page
 * Overview of all jams created by the current host
 * Route: /host/dashboard
 */

import {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {useAuth} from '../hooks'
import {jamService} from '../services'
import type {JamResponseDto} from '../types/api.types'
import {ErrorAlert, SuccessAlert} from '../components'

interface JamCategory {
  planned: JamResponseDto[]
  inProgress: JamResponseDto[]
  past: JamResponseDto[]
}

export function HostDashboardPage() {
  const navigate = useNavigate()
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const [jams, setJams] = useState<JamResponseDto[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    // Wait for auth to finish loading
    if (authLoading) {
      return
    }

    // If not authenticated after auth is loaded, redirect to login
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    // Auth is ready and user is authenticated, load jams
    loadJams()
  }, [authLoading, isAuthenticated, navigate])

  const loadJams = async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await jamService.findAll()
      setJams(result.data || [])
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load jams'
      console.error('❌ Error loading jams:', err)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const categorizeJams = (): JamCategory => {
    const now = new Date()
    const categorized: JamCategory = {
      planned: [],
      inProgress: [],
      past: [],
    }

    jams.forEach((jam) => {
      if (jam.status === 'FINISHED') {
        categorized.past.push(jam)
      } else if (jam.status === 'ACTIVE') {
        categorized.inProgress.push(jam)
      } else {
        categorized.planned.push(jam)
      }
    })

    return categorized
  }

  const calculateStats = () => {
    const totalJams = jams.length

    // Deduplicate musicians by musicianId across all registrations
    const uniqueMusicians = new Set<string>()
    jams.forEach((jam) => {
      jam.registrations?.forEach((reg) => {
        uniqueMusicians.add(reg.musicianId)
      })
    })
    const totalMusicians = uniqueMusicians.size

    // Count schedules for total songs
    const totalSongs = jams.reduce((sum, jam) => sum + (jam.schedules?.length || 0), 0)

    return { totalJams, totalMusicians, totalSongs }
  }

  const handleDeleteJam = async (jamId: string) => {
    if (!confirm('Are you sure you want to delete this jam? This action cannot be undone.')) {
      return
    }

    setLoading(true)
    setError(null)

    try {
      await jamService.deleteFn(jamId)
      setSuccess('Jam deleted successfully')
      await loadJams()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete jam')
    } finally {
      setLoading(false)
    }
  }

  const categories = categorizeJams()
  const stats = calculateStats()

  // Show loading spinner while auth is initializing
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-100">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-100 p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-4xl font-bold">🎭 Host Dashboard</h1>
            <button
              onClick={() => navigate('/host/create-jam')}
              className="btn btn-primary"
              disabled={loading}
            >
              + Create New Jam
            </button>
          </div>

          {/* Alerts */}
          {error && <ErrorAlert message={error} onDismiss={() => setError(null)} />}
          {success && <SuccessAlert message={success} onDismiss={() => setSuccess(null)} />}
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="stats shadow bg-base-200">
            <div className="stat">
              <div className="stat-title">Total Jams</div>
              <div className="stat-value text-primary">{stats.totalJams}</div>
            </div>
          </div>

          <div className="stats shadow bg-base-200">
            <div className="stat">
              <div className="stat-title">Musicians</div>
              <div className="stat-value text-secondary">{stats.totalMusicians}</div>
            </div>
          </div>

          <div className="stats shadow bg-base-200">
            <div className="stat">
              <div className="stat-title">Songs</div>
              <div className="stat-value text-accent">{stats.totalSongs}</div>
            </div>
          </div>

          <div className="stats shadow bg-base-200">
            <div className="stat">
              <div className="stat-title">Upcoming</div>
              <div className="stat-value text-success">{categories.planned.length}</div>
            </div>
          </div>
        </div>

        {loading && jams.length === 0 ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : jams.length === 0 ? (
          <div className="alert alert-info mb-8">
            <p>You haven't created any jams yet. Click "Create New Jam" to get started!</p>
          </div>
        ) : (
          <>
            {/* Planned Jams */}
            {categories.planned.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">📅 Planned Jams</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.planned.map((jam) => (
                    <JamCard
                      key={jam.id}
                      jam={jam}
                      onDelete={handleDeleteJam}
                      onNavigate={navigate}
                      loading={loading}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* In Progress Jams */}
            {categories.inProgress.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">🎵 In Progress</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.inProgress.map((jam) => (
                    <JamCard
                      key={jam.id}
                      jam={jam}
                      onDelete={handleDeleteJam}
                      onNavigate={navigate}
                      loading={loading}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Past Jams */}
            {categories.past.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">✅ Past Jams</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.past.map((jam) => (
                    <JamCard
                      key={jam.id}
                      jam={jam}
                      onDelete={handleDeleteJam}
                      onNavigate={navigate}
                      loading={loading}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

/**
 * Jam Card Component for Dashboard
 */
interface JamCardProps {
  jam: JamResponseDto
  onDelete: (jamId: string) => void
  onNavigate: (path: string) => void
  loading: boolean
}

function JamCard({ jam, onDelete, onNavigate, loading }: JamCardProps) {
  const getStatusBadgeColor = () => {
    switch (jam.status) {
      case 'ACTIVE':
        return 'badge-success'
      case 'INACTIVE':
        return 'badge-warning'
      case 'FINISHED':
        return 'badge-error'
      default:
        return 'badge-outline'
    }
  }

  // Calculate unique musicians in this jam
  const uniqueMusiciansInJam = new Set<string>()
  jam.registrations?.forEach((reg) => {
    uniqueMusiciansInJam.add(reg.musicianId)
  })

  const songCount = jam.schedules?.length || 0
  const musicianCount = uniqueMusiciansInJam.size

  return (
    <div className="card bg-base-200 shadow-lg hover:shadow-xl transition-shadow">
      <div className="card-body">
        <div className="flex items-start justify-between gap-2">
          <h3 className="card-title text-lg">{jam.name}</h3>
          <div className={`badge ${getStatusBadgeColor()}`}>{jam.status}</div>
        </div>

        <div className="space-y-2 text-sm">
          {jam.date && (
            <p className="text-base-content/70">
              📅 {new Date(jam.date).toLocaleDateString()}
            </p>
          )}
          {jam.description && (
            <p className="text-base-content/70 truncate">{jam.description}</p>
          )}
        </div>

        <div className="flex gap-2 mt-4">
          <span className="badge badge-outline">
            🎵 {songCount} songs
          </span>
          <span className="badge badge-outline">
            👥 {musicianCount} musicians
          </span>
        </div>

        <div className="card-actions justify-between mt-6">
          <div className="flex gap-2">
            <button
              onClick={() => onNavigate(`/jams/${jam.id}`)}
              className="btn btn-sm btn-ghost"
              disabled={loading}
            >
              View
            </button>
            <button
              onClick={() => onNavigate(`/host/jams/${jam.id}/manage`)}
              className="btn btn-sm btn-primary"
              disabled={loading}
            >
              Manage
            </button>
          </div>
          <button
            onClick={() => onDelete(jam.id)}
            className="btn btn-sm btn-error btn-outline"
            disabled={loading}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default HostDashboardPage

