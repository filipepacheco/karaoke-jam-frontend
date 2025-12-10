/**
 * Music Empty State Component
 * Displays when no music matches the current filters
 */

interface MusicEmptyStateProps {
  hasFilters: boolean
  isHost: boolean
}

export function MusicEmptyState({ hasFilters, isHost }: MusicEmptyStateProps) {
  return (
    <div className="card bg-base-200">
      <div className="card-body text-center py-12">
        <div className="text-6xl mb-4">🎵</div>
        <h2 className="text-2xl font-bold mb-2">
          {hasFilters ? 'No songs found' : 'No music in library'}
        </h2>
        <p className="text-base-content/70">
          {hasFilters
            ? 'Try adjusting your filters'
            : isHost
              ? 'Click "Add Song" to start building your music library'
              : 'Music library is empty. Check back later!'}
        </p>
      </div>
    </div>
  )
}

