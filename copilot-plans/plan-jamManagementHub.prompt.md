## Plan: Jam Management Page (Hub) (`/host/jams/:id/manage`)

**Summary**: Create a comprehensive management hub for hosts to control all aspects of their jam sessions. This page serves as the central control center with tabbed interface for managing songs, registrations, schedules, and real-time dashboards. It provides quick status indicators, start/end jam controls, and navigation to detailed management pages.

### Key Features

1. **Unified Management Hub**
   - Single entry point for all jam management tasks
   - Tabbed navigation for different management areas
   - Quick status indicators showing jam state
   - Start/End jam session buttons

2. **Tab Structure**
   - **Overview Tab** - Jam summary, statistics, quick actions, status controls
   - **Songs Management Tab** - Add/edit/delete songs, view registrations per song
   - **Registrations Tab** - Review and approve/reject musician registrations
   - **Schedule/Lineup Tab** - Organize performance order, assign musicians to songs
   - **Real-time Dashboard Tab** - View public display as it appears to audience
   - **Analytics Tab** - Performance statistics and results

3. **Overview Section**
   - Jam name, date, time, location, status
   - Total songs, registered musicians, schedules created
   - Current performance status (if jam is active)
   - Quick action buttons: Start Jam, End Jam, Go Live
   - Recent activity feed

4. **Navigation & Context**
   - Breadcrumb: Dashboard → Jam Name → Manage
   - Back button to dashboard
   - Jam name prominently displayed
   - Current tab indicator
   - Save/Apply buttons for changes

5. **Status Management**
   - Start/End jam buttons (only in appropriate states)
   - Status indicators: ACTIVE, INACTIVE, FINISHED
   - Confirmation dialogs for state changes
   - Status update notifications

### Steps

1. **Create JamManagementPage component** at `src/pages/JamManagementPage.tsx`
   - Load jam data on mount using jamId from route params
   - Initialize state for selected tab and jam data
   - Set up tab navigation structure
   - Handle authentication and authorization checks

2. **Build tab navigation**
   - Create tab switcher component with 6 tabs
   - Store selected tab in state
   - Each tab shows/hides appropriate content
   - Tab styling with active indicator

3. **Implement Overview Tab**
   - Display jam summary info (name, date, location, status)
   - Show statistics: songs count, musicians count, schedules count
   - Display current jam status with visual indicator
   - Add Start/End jam buttons with confirmation dialogs
   - Show recent activity or upcoming songs

4. **Implement Songs Management Tab**
   - Display list of songs in the jam
   - For each song: title, artist, duration, registrations count
   - Add buttons: Add Song, Edit, Delete (with confirmations)
   - Link to detailed song management page or modal
   - Show registrations for each song

5. **Implement Registrations Tab**
   - Display all musician registrations for this jam
   - Show: musician name, instrument, songs registered, status
   - Filter options: by status (pending, approved, rejected), by song
   - Action buttons: Approve, Reject, Edit (for pending registrations)
   - Bulk approve option
   - Show registration details on click

6. **Implement Schedule/Lineup Tab**
   - Display performance schedule in order
   - Show: order number, song name, assigned musician, status
   - Drag & drop to reorder songs (if needed)
   - Reassign musician button for each slot
   - Mark as complete button (if jam is active)
   - Add/Remove slot buttons

7. **Implement Real-time Dashboard Tab**
   - Embed or link to public dashboard view (`/host/jams/:id/audience-view`)
   - Show what audience/musicians see
   - Full-screen toggle option
   - Auto-refresh indicator

8. **Implement Analytics Tab**
   - Summary statistics: total musicians, total songs, duration
   - Songs performed with musician assignments
   - Musician participation list
   - Charts/graphs (optional for MVP)
   - Export results button (optional)

9. **Add routing**
   - Route: `/host/jams/:id/manage` - Hub page
   - Route guards to ensure only authenticated hosts access
   - Load jam data and handle errors
   - Update App.tsx with new route

10. **Implement status controls**
    - Start Jam button (only when status is INACTIVE)
    - End Jam button (only when status is ACTIVE)
    - Confirmation dialogs with explanations
    - Status update via API (PATCH /jams/:id with status field)
    - Success/error notifications

### Data Requirements

From backend API:
- **GET /jams/:id** - Fetch jam details with all relationships
- **PATCH /jams/:id** - Update jam status
- Songs data via `jamsmusics` array in jam response
- Registrations via `registrations` array in jam response
- Schedules via `schedules` array in jam response

### Components Needed
- `JamManagementPage.tsx` - Main hub page
- Tab navigation component
- Overview section component
- Songs list component
- Registrations list component
- Schedule/lineup component
- Analytics component
- Status control buttons

### Tab Layout Structure
```
┌─ Header ──────────────────────────────────────┐
│ ← Dashboard  > Jam Name > Manage               │
│                                                │
│ Jam: "Jazz Night 2025"  |  Status: INACTIVE   │
└────────────────────────────────────────────────┘

┌─ Tab Navigation ──────────────────────────────┐
│ [Overview] [Songs] [Registrations] [Schedule] │
│ [Dashboard] [Analytics]                        │
└────────────────────────────────────────────────┘

┌─ Content Area ────────────────────────────────┐
│                                                │
│  [Tab-specific content]                        │
│                                                │
│  [Action buttons for this tab]                 │
│                                                │
└────────────────────────────────────────────────┘

┌─ Status Controls ─────────────────────────────┐
│  [Start Jam] [End Jam] [Save Changes]         │
└────────────────────────────────────────────────┘
```

### API Integration Points
- **GET** `/jams/:id` - Load jam data with all relationships
- **PATCH** `/jams/:id` - Update jam status (ACTIVE/INACTIVE/FINISHED)
- **PATCH** `/escalas/:id` - Update schedule status
- **POST** `/jams/:id/musicas` - Add song to jam
- **DELETE** `/jams/:id/musicas/:musicId` - Remove song from jam
- **PATCH** `/inscricoes/:id` - Approve/reject registration
- **POST** `/escalas` - Create schedule entry
- **PATCH** `/escalas/:id/reorder` - Reorder schedules

### Files to Create/Modify
- `src/pages/JamManagementPage.tsx` - New hub page component
- `src/App.tsx` - Add route `/host/jams/:id/manage`
- `src/services/jamService.ts` - May need additional helper functions

### Further Considerations
1. **Tab Persistence**: Should selected tab persist in URL query params or localStorage?
2. **Real-time Updates**: Should data auto-refresh at intervals, or only on manual refresh?
3. **Nested Navigation**: Should detailed edit pages replace tab content, or open as modals/separate pages?
4. **Bulk Actions**: Should we support bulk approve/reject for registrations?
5. **Undo/Revert**: Should we support reverting recent actions if changes haven't been saved?
6. **Performance**: How to handle jams with many songs/registrations (pagination or virtual scroll)?
7. **Drag & Drop**: Should schedule reordering use drag-drop or arrow buttons?
8. **Public View**: Should audience-view tab be embedded iframe or link to separate page?
9. **Permissions**: Should we verify host owns this jam before allowing access?
10. **Mobile**: Should this hub work on mobile, or desktop-only?

