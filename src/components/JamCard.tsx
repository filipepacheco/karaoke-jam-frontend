/**
 * Jam Card Component
 * Displays individual jam session information in a card format
 */

import {Link} from 'react-router-dom'
import type {JamResponseDto, JamStatus} from '../types/api.types'

interface JamCardProps {
  jam: JamResponseDto
  isAuthenticated: boolean
}

/**
 * Format ISO date string to readable format
 */
function formatDate(isoString: string): string {
  const date = new Date(isoString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

/**
 * Truncate text to specified length
 */
function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

/**
 * Get badge class based on jam status
 */
function getStatusBadgeClass(status: JamStatus): string {
  switch (status) {
    case 'ACTIVE':
      return 'badge-success'
    case 'INACTIVE':
      return 'badge-warning'
    case 'FINISHED':
      return 'badge-neutral'
    default:
      return 'badge-ghost'
  }
}

/**
 * JamCard Component
 */
export function JamCard({ jam, isAuthenticated }: JamCardProps) {
  // Use schedules count as it represents actual performances
  // Fall back to jamMusics count if schedules not available
  const songCount = jam.schedules?.length || jam.jamMusics?.length || 0


  return (
    <div className="card bg-base-200 shadow-lg hover:shadow-xl transition-shadow">
      <div className="card-body">
        {/* Header: Name + Status Badge */}
        <div className="flex justify-between items-start gap-2">
          <h3 className="card-title text-lg">{jam.name || 'No name'}</h3>
          <div className={`badge ${getStatusBadgeClass(jam.status)}`}>
            {jam.status || 'UNKNOWN'}
          </div>
        </div>

        {/* Date */}
        {jam.date && (
          <p className="text-sm text-base-content/70">
            📅 {formatDate(jam.date)}
          </p>
        )}

        {/* Description */}
        {jam.description && (
          <p className="text-sm text-base-content/80 mt-2">
            {truncate(jam.description, 100)}
          </p>
        )}

        {/* Song Count */}
        <div className="flex items-center gap-2 mt-2">
          <div className="text-xs text-base-content/60">
            🎵 {songCount} {songCount === 1 ? 'song' : 'songs'}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="card-actions justify-end mt-4">
          <Link to={`/jams/${jam.id}`} className="btn btn-primary btn-sm">
            View Details
          </Link>

          {isAuthenticated && jam.status === 'ACTIVE' && (
            <Link
              to={`/jams/${jam.id}/register`}
              className="btn btn-secondary btn-sm"
            >
              Join Jam
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default JamCard

