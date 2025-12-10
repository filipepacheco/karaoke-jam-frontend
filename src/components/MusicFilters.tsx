/**
 * Music Filters Component
 * Search, genre filter, sort, and clear controls
 */

interface MusicFiltersProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  genreFilter: string
  onGenreChange: (genre: string) => void
  sortBy: 'title' | 'artist' | 'date'
  onSortChange: (sort: 'title' | 'artist' | 'date') => void
  onClearFilters: () => void
  genres: string[]
}

export function MusicFilters({
  searchTerm,
  onSearchChange,
  genreFilter,
  onGenreChange,
  sortBy,
  onSortChange,
  onClearFilters,
  genres,
}: MusicFiltersProps) {
  return (
    <div className="card bg-base-200 shadow">
      <div className="card-body p-4">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Search */}
          <div className="form-control flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search by title or artist..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="input input-bordered"
            />
          </div>

          {/* Genre Filter */}
          <div className="form-control min-w-[150px]">
            <select
              value={genreFilter}
              onChange={(e) => onGenreChange(e.target.value)}
              className="select select-bordered"
            >
              <option value="">All Genres</option>
              {genres.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="form-control min-w-[150px]">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as 'title' | 'artist' | 'date')}
              className="select select-bordered"
            >
              <option value="title">Sort by Title</option>
              <option value="artist">Sort by Artist</option>
              <option value="date">Sort by Date Added</option>
            </select>
          </div>

          {/* Clear Filters */}
          <button onClick={onClearFilters} className="btn btn-ghost">
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  )
}

