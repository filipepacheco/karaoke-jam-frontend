## Plan: Browse Jams Page (`/jams`)

Build `/jams` as a public page that fetches all jams through `useJams()`, manages loading/error states, offers **client-side** search/status/date filters, displays jam cards with view/join actions, and allows both authenticated and unauthenticated access (no login prompts).

### Overview

- **Route**: `/jams` (public, accessible to all visitors)
- **Data Source**: `useJams()` hook → `jamService.findAll()` → returns `ApiResponse<JamResponseDto[]>`
- **Filtering**: **Client-side only** (filter the fetched array in React state, no API query params)
- **Authentication**: Not required; unauthenticated visitors can browse and view jam details
- **Navigation**: 
  - All users can click "View Details" → `/jams/:jamId`
  - Authenticated users see "Join" button → `/jams/:jamId/register`
  - Unauthenticated users see "View Details" only (can access dashboard in future)

### Data Structure

**Source**: `JamResponseDto` from `src/types/api.types.ts`

```typescript
interface JamResponseDto {
  id: string
  nome: string
  descricao?: string
  data?: string              // ISO date string
  qrCode?: string
  status: JamStatus          // 'ACTIVE' | 'INACTIVE' | 'FINISHED'
  createdAt: string
  updatedAt: string
  jamsmusics?: JamMusicaResponseDto[]  // Songs in jam
}
```

### Steps

#### 1. Create `/jams` Route
- Add route in `App.tsx` under public routes section
- Render `BrowseJamsPage` component with `Navbar`
- Position after `/register` and before `/jams/:jamId`

```typescript
<Route path="/jams" element={
  <>
    <Navbar />
    <BrowseJamsPage />
  </>
} />
```

#### 2. Create `BrowseJamsPage` Component
**File**: `src/pages/BrowseJamsPage.tsx`

**Layout Structure**:
```
┌─────────────────────────────────────┐
│ Navbar (shared)                      │
├─────────────────────────────────────┤
│ Hero Section                         │
│ - Title: "Browse Jam Sessions"      │
│ - Subtitle/Description               │
├─────────────────────────────────────┤
│ Filters & Search Panel               │
│ - Search input (name/description)    │
│ - Status filter (All/Active/...)     │
│ - Date sort (Newest/Oldest/Date)     │
│ - Results count badge                │
├─────────────────────────────────────┤
│ Jam Cards Grid (responsive)          │
│ ┌──────┐ ┌──────┐ ┌──────┐          │
│ │ Jam  │ │ Jam  │ │ Jam  │          │
│ │ Card │ │ Card │ │ Card │          │
│ └──────┘ └──────┘ └──────┘          │
│ (2-3 cols on desktop, 1 on mobile)   │
├─────────────────────────────────────┤
│ Empty State (if no results)          │
└─────────────────────────────────────┘
```

#### 3. Fetch Data with `useJams()` Hook
```typescript
import { useJams } from '../hooks'

function BrowseJamsPage() {
  const { data: jams, loading, error, refetch } = useJams()
  
  // jams is JamResponseDto[] or null
  // Handle loading, error, and empty states
}
```

#### 4. Implement Client-Side Filtering

**Filter State**:
```typescript
const [searchQuery, setSearchQuery] = useState('')
const [statusFilter, setStatusFilter] = useState<'ALL' | JamStatus>('ALL')
const [dateSort, setDateSort] = useState<'newest' | 'oldest' | 'upcoming'>('newest')
```

**Filter Logic** (useMemo for performance):
```typescript
const filteredJams = useMemo(() => {
  if (!jams) return []
  
  let result = [...jams]
  
  // 1. Search filter (name + description)
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase()
    result = result.filter(jam => 
      jam.nome.toLowerCase().includes(query) ||
      jam.descricao?.toLowerCase().includes(query)
    )
  }
  
  // 2. Status filter
  if (statusFilter !== 'ALL') {
    result = result.filter(jam => jam.status === statusFilter)
  }
  
  // 3. Date sorting
  result.sort((a, b) => {
    if (dateSort === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    } else if (dateSort === 'oldest') {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    } else { // 'upcoming'
      if (!a.data || !b.data) return 0
      return new Date(a.data).getTime() - new Date(b.data).getTime()
    }
  })
  
  return result
}, [jams, searchQuery, statusFilter, dateSort])
```

#### 5. Create Jam Card Component
**File**: `src/components/JamCard.tsx`

**Card Content**:
- Jam name (title)
- Status badge (ACTIVE/INACTIVE/FINISHED)
- Date (formatted, if available)
- Description (truncated, if available)
- Song count (from `jamsmusics?.length`)
- Action buttons:
  - "View Details" (always visible) → `/jams/:jamId`
  - "Join Jam" (authenticated only) → `/jams/:jamId/register`

**Props**:
```typescript
interface JamCardProps {
  jam: JamResponseDto
  isAuthenticated: boolean
}
```

**Example Card**:
```tsx
<div className="card bg-base-200 shadow-lg">
  <div className="card-body">
    <div className="flex justify-between items-start">
      <h3 className="card-title">{jam.nome}</h3>
      <div className={`badge ${getStatusBadgeClass(jam.status)}`}>
        {jam.status}
      </div>
    </div>
    
    {jam.data && (
      <p className="text-sm text-base-content/70">
        📅 {formatDate(jam.data)}
      </p>
    )}
    
    {jam.descricao && (
      <p className="text-sm">{truncate(jam.descricao, 100)}</p>
    )}
    
    <div className="text-xs text-base-content/60">
      🎵 {jam.jamsmusics?.length || 0} songs
    </div>
    
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
```

#### 6. Add Filter/Search UI Components

**Search Input**:
```tsx
<input
  type="text"
  placeholder="Search jams by name or description..."
  className="input input-bordered w-full"
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
/>
```

**Status Filter (Radio or Tabs)**:
```tsx
<div className="tabs tabs-boxed">
  <button 
    className={`tab ${statusFilter === 'ALL' ? 'tab-active' : ''}`}
    onClick={() => setStatusFilter('ALL')}
  >
    All
  </button>
  <button 
    className={`tab ${statusFilter === 'ACTIVE' ? 'tab-active' : ''}`}
    onClick={() => setStatusFilter('ACTIVE')}
  >
    Active
  </button>
  <button 
    className={`tab ${statusFilter === 'INACTIVE' ? 'tab-active' : ''}`}
    onClick={() => setStatusFilter('INACTIVE')}
  >
    Inactive
  </button>
  <button 
    className={`tab ${statusFilter === 'FINISHED' ? 'tab-active' : ''}`}
    onClick={() => setStatusFilter('FINISHED')}
  >
    Finished
  </button>
</div>
```

**Date Sort (Select)**:
```tsx
<select 
  className="select select-bordered"
  value={dateSort}
  onChange={(e) => setDateSort(e.target.value as any)}
>
  <option value="newest">Newest First</option>
  <option value="oldest">Oldest First</option>
  <option value="upcoming">Upcoming Events</option>
</select>
```

**Results Count**:
```tsx
<div className="badge badge-primary badge-lg">
  {filteredJams.length} {filteredJams.length === 1 ? 'Jam' : 'Jams'}
</div>
```

#### 7. Handle Loading/Error/Empty States

**Loading State**:
```tsx
{loading && (
  <div className="flex justify-center items-center min-h-[400px]">
    <span className="loading loading-spinner loading-lg"></span>
  </div>
)}
```

**Error State**:
```tsx
{error && (
  <ErrorAlert
    title="Failed to Load Jams"
    message={error}
  />
)}
```

**Empty State** (no jams):
```tsx
{!loading && !error && filteredJams.length === 0 && (
  <div className="text-center py-12">
    <div className="text-6xl mb-4">🎸</div>
    <h3 className="text-2xl font-bold mb-2">No Jams Found</h3>
    <p className="text-base-content/70 mb-4">
      {searchQuery || statusFilter !== 'ALL'
        ? 'Try adjusting your filters'
        : 'Be the first to create a jam session!'}
    </p>
    {searchQuery || statusFilter !== 'ALL' ? (
      <button 
        className="btn btn-primary"
        onClick={() => {
          setSearchQuery('')
          setStatusFilter('ALL')
        }}
      >
        Clear Filters
      </button>
    ) : null}
  </div>
)}
```

#### 8. Responsive Grid Layout

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {filteredJams.map(jam => (
    <JamCard 
      key={jam.id} 
      jam={jam} 
      isAuthenticated={isAuthenticated}
    />
  ))}
</div>
```

### Component Structure

```
src/
├── pages/
│   └── BrowseJamsPage.tsx          (Main page component)
├── components/
│   └── JamCard.tsx                 (Individual jam card)
└── hooks/
    └── useJam.ts                   (Already exists)
```

### Files to Create/Modify

1. **Create**: `src/pages/BrowseJamsPage.tsx` (~200 lines)
2. **Create**: `src/components/JamCard.tsx` (~100 lines)
3. **Modify**: `src/App.tsx` (add route)
4. **Modify**: `src/components/index.ts` (export JamCard)

### Utility Functions Needed

```typescript
// Format date
function formatDate(isoString: string): string {
  const date = new Date(isoString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

// Truncate text
function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

// Get status badge class
function getStatusBadgeClass(status: JamStatus): string {
  switch (status) {
    case 'ACTIVE': return 'badge-success'
    case 'INACTIVE': return 'badge-warning'
    case 'FINISHED': return 'badge-neutral'
    default: return 'badge-ghost'
  }
}
```

### Authentication Integration

```typescript
import { useAuth } from '../hooks'

function BrowseJamsPage() {
  const { isAuthenticated } = useAuth()
  
  // Pass to JamCard components
  return (
    <JamCard jam={jam} isAuthenticated={isAuthenticated} />
  )
}
```

### Navigation Flow

1. **Unauthenticated User**:
   - `/jams` → Browse all jams
   - Click "View Details" → `/jams/:jamId` (public view)
   - No "Join" button shown

2. **Authenticated User**:
   - `/jams` → Browse all jams
   - Click "View Details" → `/jams/:jamId` (detail view)
   - Click "Join Jam" → `/jams/:jamId/register` (registration flow)

### DaisyUI Components to Use

- `card` + `card-body` + `card-title` + `card-actions` (jam cards)
- `badge` (status, count)
- `tabs` or `tabs-boxed` (status filter)
- `input` + `input-bordered` (search)
- `select` + `select-bordered` (date sort)
- `btn` + `btn-primary` / `btn-secondary` (actions)
- `loading` + `loading-spinner` (loading state)
- `grid` (responsive layout)

### Testing Checklist

- [ ] Page loads without errors
- [ ] `useJams()` hook fetches data successfully
- [ ] Loading spinner shows during fetch
- [ ] Error message displays if fetch fails
- [ ] Search filter works (case-insensitive, matches name + description)
- [ ] Status filter works (shows correct jams per status)
- [ ] Date sort works (newest/oldest/upcoming)
- [ ] Results count updates correctly
- [ ] Empty state shows when no jams match filters
- [ ] Clear filters button resets all filters
- [ ] Jam cards display all information correctly
- [ ] "View Details" button navigates to jam detail page
- [ ] "Join Jam" button only shows for authenticated users
- [ ] "Join Jam" button only shows for ACTIVE jams
- [ ] Responsive layout works on mobile/tablet/desktop
- [ ] Status badges use correct colors
- [ ] Dates format correctly
- [ ] Song count displays correctly

### Performance Considerations

1. **useMemo**: Wrap filtering logic to avoid re-computing on every render
2. **Debounce**: Consider debouncing search input (optional, for large lists)
3. **Virtualization**: Not needed for MVP (add if >100 jams)

### Accessibility

- Add `aria-label` to search input
- Add `role="tablist"` and `role="tab"` to status filter
- Ensure keyboard navigation works for all controls
- Add loading announcements with `aria-live`

### Future Enhancements

1. Add pagination if jam count grows large (>50 items)
2. Add "Featured" or "Recommended" section at top
3. Add map view for jams with location data
4. Add ability to favorite/bookmark jams
5. Add export/share filtered results
6. Add advanced filters (date range picker, location, etc.)
7. Add sorting by popularity/musician count
8. Add real-time updates when new jams are created


