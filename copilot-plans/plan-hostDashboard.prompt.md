## Plan: Host Dashboard (`/host/dashboard`)

**Summary**: Create a comprehensive dashboard for jam organizers to manage all their created jams. Display jams categorized by status (planned, in progress, past), with quick stats and actions for each jam. Provide quick access to jam management features and overall statistics.

### Key Features

1. **Jam Listing by Status**
   - Three sections: Planned (upcoming), In Progress (active), Past (completed)
   - For each jam show: name, date/time, musician count, song count, status badge
   - Quick action buttons: Edit, View, Manage, Go Live, Analytics

2. **Overall Statistics**
   - Total jams created
   - Total musicians across all jams
   - Total songs across all jams
   - Upcoming events count

3. **Quick Actions**
   - "Create New Jam" button (primary CTA)
   - Search/filter jams by name or date
   - Recent activity log or notifications

4. **Jam Card Information**
   - Jam name (clickable link to detail)
   - Date and time
   - Location (if available)
   - Musician count badge
   - Song count badge
   - Status indicator (ACTIVE, INACTIVE, FINISHED)
   - Quick action dropdown menu

### Steps

1. **Create HostDashboardPage component** at `src/pages/HostDashboardPage.tsx`
   - Fetch all jams where `hostId === currentUser.id`
   - Load jams on component mount using `useEffect`
   - Implement loading and error states

2. **Categorize jams by status**
   - Use Jam status field (ACTIVE, INACTIVE, FINISHED)
   - Alternative: categorize by date (upcoming vs past)
   - Group jams for display in three sections

3. **Build Jam Card component**
   - Display jam name, date, host, musician count, song count
   - Show status badge with color coding
   - Implement quick action buttons in card footer or dropdown menu

4. **Display overall statistics**
   - Count total jams
   - Sum musicians across all jams  
   - Sum songs across all jams
   - Calculate upcoming events

5. **Add navigation/routing**
   - Create route at `App.tsx`: `/host/dashboard`
   - Add route guards to ensure only authenticated users access
   - Redirect to login if not authenticated

6. **Implement search/filter** (optional for MVP)
   - Filter by jam name
   - Filter by date range
   - Sort by date, musician count, etc.

7. **Add "Create New Jam" button**
   - Navigate to `/host/create-jam` when clicked
   - Button should be prominent (primary style)

### Data Requirements

From backend API:
- **GET /jams** - Need to filter by current user's hostId
- Each jam needs: id, name, date, status, hostId, jamsmusics count, registrations count
- Current user info from auth context

### Components Needed
- `HostDashboardPage.tsx` - Main dashboard page
- `JamCard.tsx` (reusable) - Display individual jam with quick actions
- `StatisticsCard.tsx` (reusable) - Show stat boxes (total jams, musicians, songs)

### UI Layout
```
┌─ Header ─────────────────────────────────────┐
│  Host Dashboard     [+ Create New Jam]        │
└──────────────────────────────────────────────┘

┌─ Statistics Bar ──────────────────────────────┐
│  Total Jams: 5 │ Musicians: 24 │ Songs: 18   │
└──────────────────────────────────────────────┘

┌─ Planned Jams ────────────────────────────────┐
│ [Card] Jazz Night 2025        Dec 15, 2025    │
│        🎵 3 songs | 👥 8 musicians | [ACTIVE] │
│        [Manage] [Edit] [Go Live] [Analytics]  │
│                                               │
│ [Card] Blues Jam              Dec 22, 2025    │
│        🎵 4 songs | 👥 6 musicians | [ACTIVE] │
│        [Manage] [Edit] [Go Live] [Analytics]  │
└──────────────────────────────────────────────┘

┌─ In Progress ──────────────────────────────────┐
│ [Card] Latin Jazz Session     Dec 8, 2025     │
│        🎵 5 songs | 👥 10 musicians|[IN PROG] │
│        [View] [End Event] [Live Dashboard]    │
└──────────────────────────────────────────────┘

┌─ Past Jams ────────────────────────────────────┐
│ [Card] Rock Cover Night       Dec 1, 2025     │
│        🎵 6 songs | 👥 12 musicians|[FINISHED]│
│        [View] [Analytics] [Re-use Template]   │
└──────────────────────────────────────────────┘
```

### API Integration Points
- Fetch user's jams (GET /jams - filtered by hostId)
- Delete jam (DELETE /jams/:id)
- Update jam status (PATCH /jams/:id)
- Get jam details (GET /jams/:id)

### Files to Create/Modify
- `src/pages/HostDashboardPage.tsx` - New page component
- `src/App.tsx` - Add route `/host/dashboard`
- `src/components/JamCard.tsx` - Reusable jam card (if not exists)
- `src/components/StatisticsCard.tsx` - Reusable stats display (if not exists)

### Further Considerations
1. **Sorting & Filtering**: Should we implement search/filter in MVP or add later?
2. **Empty State**: What should show when host has no jams yet?
3. **Quick Actions**: Should action buttons be inline or in a dropdown menu for cleaner UI?
4. **Real-time Updates**: Should jams update in real-time when status changes (ACTIVE → FINISHED)?
5. **Past Jams Limit**: Should we paginate or show all past jams? Limit to last 10?

