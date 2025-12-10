/**
 * Browse Jams Page
 * Public page for browsing all available jam sessions with filters
 */

import { useState, useMemo } from 'react'
import { useAuth, useJams } from '../hooks'
import { JamCard } from '../components/JamCard'
import { ErrorAlert } from '../components'
import type { JamStatus } from '../types/api.types'

type DateSortOption = 'newest' | 'oldest' | 'upcoming'

export function BrowseJamsPage() {
  const { data: jams, loading, error } = useJams()
  const { isAuthenticated } = useAuth()


  // Filter state
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'ALL' | JamStatus>('ALL')
  const [dateSort, setDateSort] = useState<DateSortOption>('newest')

  // Client-side filtering and sorting
  const filteredJams = useMemo(() => {
    if (!jams) return []

    let result = [...jams]

    // 1. Search filter (name + description)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (jam) =>
          jam.name.toLowerCase().includes(query) ||
          jam.description?.toLowerCase().includes(query)
      )
    }

    // 2. Status filter
    if (statusFilter !== 'ALL') {
      result = result.filter((jam) => jam.status === statusFilter)
    }

    // 3. Date sorting
    result.sort((a, b) => {
      if (dateSort === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      } else if (dateSort === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      } else {
        // 'upcoming'
        if (!a.date || !b.date) return 0
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      }
    })

    return result
  }, [jams, searchQuery, statusFilter, dateSort])

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('')
    setStatusFilter('ALL')
    setDateSort('newest')
  }

  // Check if any filters are active
  const hasActiveFilters = searchQuery.trim() !== '' || statusFilter !== 'ALL'

  return (
    <div className="min-h-screen bg-base-100">
      {/* Hero Section */}
      <div className="bg-primary text-primary-content">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            🎸 Browse Jam Sessions
          </h1>
          <p className="text-lg md:text-xl opacity-90">
            Discover and join exciting jam sessions in your area
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Filters & Search Panel */}
        <div className="card bg-base-200 shadow-lg mb-8">
          <div className="card-body">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1">
                <label className="label">
                  <span className="label-text font-semibold">Search</span>
                </label>
                <input
                  type="text"
                  placeholder="Search jams by name or description..."
                  className="input input-bordered w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search jams"
                />
              </div>

              {/* Date Sort */}
              <div className="w-full lg:w-48">
                <label className="label">
                  <span className="label-text font-semibold">Sort By</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={dateSort}
                  onChange={(e) => setDateSort(e.target.value as DateSortOption)}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="upcoming">Upcoming Events</option>
                </select>
              </div>
            </div>

            {/* Status Filter Tabs */}
            <div className="mt-4">
              <label className="label">
                <span className="label-text font-semibold">Filter by Status</span>
              </label>
              <div className="tabs tabs-boxed" role="tablist">
                <button
                  className={`tab ${statusFilter === 'ALL' ? 'tab-active' : ''}`}
                  onClick={() => setStatusFilter('ALL')}
                  role="tab"
                  aria-selected={statusFilter === 'ALL'}
                >
                  All
                </button>
                <button
                  className={`tab ${statusFilter === 'ACTIVE' ? 'tab-active' : ''}`}
                  onClick={() => setStatusFilter('ACTIVE')}
                  role="tab"
                  aria-selected={statusFilter === 'ACTIVE'}
                >
                  Active
                </button>
                <button
                  className={`tab ${statusFilter === 'INACTIVE' ? 'tab-active' : ''}`}
                  onClick={() => setStatusFilter('INACTIVE')}
                  role="tab"
                  aria-selected={statusFilter === 'INACTIVE'}
                >
                  Inactive
                </button>
                <button
                  className={`tab ${statusFilter === 'FINISHED' ? 'tab-active' : ''}`}
                  onClick={() => setStatusFilter('FINISHED')}
                  role="tab"
                  aria-selected={statusFilter === 'FINISHED'}
                >
                  Finished
                </button>
              </div>
            </div>

            {/* Results Count & Clear Filters */}
            <div className="flex items-center justify-between mt-4">
              <div className="badge badge-primary badge-lg">
                {filteredJams.length} {filteredJams.length === 1 ? 'Jam' : 'Jams'}
              </div>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="btn btn-ghost btn-sm"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center min-h-[400px]">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <ErrorAlert title="Failed to Load Jams" message={error} />
        )}

        {/* Jam Cards Grid */}
        {!loading && !error && filteredJams.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJams.map((jam) => (
              <JamCard
                key={jam.id}
                jam={jam}
                isAuthenticated={isAuthenticated}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredJams.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎸</div>
            <h3 className="text-2xl font-bold mb-2">No Jams Found</h3>
            <p className="text-base-content/70 mb-4">
              {hasActiveFilters
                ? 'Try adjusting your filters to see more results'
                : 'Be the first to create a jam session!'}
            </p>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="btn btn-primary">
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default BrowseJamsPage

