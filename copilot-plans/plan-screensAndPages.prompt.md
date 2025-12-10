## Plan: Screens & Pages Structure for Jam Session App

This plan outlines all screens/pages we need to build based on the project requirements and the three user roles (Host, Musician, Viewer/Public).

### 1. Public/Shared Screens (Accessible to All)

**1.1 Landing/Home Page**
- Overview of the application
- Call-to-action to "Create Jam" (Host) or "Join Jam" (Musician)
- Featured/recent jams
- Statistics (total jams, musicians, songs)

**1.2 Browse Jams Page** (`/jams`)
- List of all available jams with filters (status, date)
- Search functionality
- Each jam card shows: name, date, host, musician count
- "View Details" or "Join" button

**1.3 Jam Detail Page** (`/jams/:id`)
- Full jam information
- List of songs in the jam
- List of registered musicians
- Performance schedule/lineup
- "Register/Join This Jam" button (links to `/jams/:id/register` with pre-filled jam context)
- For already registered musicians: show current registration status

**1.4 Public Dashboard/Panel** (`/public/jam/:id`)
- Real-time display of currently playing song
- Next upcoming songs
- Scheduled musicians for each song
- Large display for projector/screen
- Auto-refresh for real-time updates

---

### 2. Musician (User) Screens

**2.1 Registration Page** (`/register` or `/jams/:id/register`)

**Global Registration** (`/register`)
- Used when musician registers without jam context
- Registration form:
  - Name (required)
  - Phone (required, unique identifier)
  - Specialty/Instrument (optional)
  - Level (optional: beginner, intermediate, advanced, professional)
- "Create Account" button
- "Already have an account? Login" link
- Post-registration: redirect to home or jam browser

**Jam-Specific Registration** (`/jams/:id/register`)
- Used when musician registers for a specific jam
- **Jam Context Display** (at top):
  - Jam name and date
  - Host name
  - Required specialties with slot counts (e.g., "2 vocals, 1 rhythm guitar, 1 lead guitar, 1 bass, 1 drums")
  - Available slots remaining per specialty
  - QR code or jam code
  
- **Registration Form** (pre-filled with jam context):
  - Name (required, empty)
  - Phone (required, empty, must be unique per jam)
  - Specialty/Instrument (required, pre-selected with most needed instrument for this jam)
  - Level (optional: beginner, intermediate, advanced, professional)
  - Confirmation checkbox: "I understand my registration is pending host approval"
  
- **Actions**:
  - "Join This Jam" button (highlights jam-specific action)
  - "Continue as Viewer" link (skip registration, join public dashboard)
  - "Back to Jam" button
  
- **Post-Registration**:
  - Show confirmation with registration status (pending)
  - Show next steps: "Your registration is pending host approval"
  - Show estimated approval time
  - Option to join public dashboard while waiting
  - Redirect options: view public dashboard, back to jam detail, or go home

**2.2 Musician Profile** (`/profile`)
- View/edit personal info
- Performance history
- Upcoming performances
- Statistics

**2.3 My Registrations Page** (`/my-registrations`)
- List of all jams musician is registered for
- Filter by status (pending, approved, rejected)
- Registration status for each
- Edit/Cancel buttons (if pending)
- Quick view: next performance, pending approvals

**2.4 My Performance Schedule** (`/my-performances`)
- Upcoming performances with assigned songs
- Current jam status (if in progress)
- Performance history
- Checklist view with start times
- Jam location/details for upcoming performances

**2.5 Jam Participation Status** (`/jams/:id/my-status`)
- Current registration status in this jam
- Songs registered for and their status
- Position in schedule
- Real-time updates
- Notification if registration approved/rejected
- Option to withdraw registration

---

### 3. Host (Organizer) Screens

**3.1 Host Dashboard** (`/host/dashboard`)
- Overview of all jams (created by this host)
- Categorized by: planned, in progress, past
- For each jam: name, date, status, musician count, song count
- Quick actions: Edit, View, Manage, Go Live, Analytics
- "Create New Jam" button
- Statistics and recent activity log

**3.2 Create/Edit Jam** (`/host/create-jam`, `/host/jams/:id/edit`)
- Form: name, date, time, description, location, status
- Publish/Share button
- QR code generation
- Share link copy button

**3.3 Jam Management Page (Hub)** (`/host/jams/:id/manage`)
- Overall control center with tabs:
  - Overview
  - Songs Management
  - Registrations
  - Schedule/Lineup
  - Real-time Dashboard
  - Analytics
- Quick status indicator
- Start/End jam buttons

**3.4 Songs Management** (`/host/jams/:id/songs`)
- List of all songs with title, artist, duration
- Slots by specialty (e.g., "2 guitars - 1 rhythm, 1 lead")
- Current registrations per slot
- Add/Edit/Delete song buttons
- Drag & drop to reorder songs
- View registrations for each song

**3.5 Registrations Management** (`/host/jams/:id/registrations`)
- List of all musician registrations
- Filter by song, status, specialty
- For each: musician name, phone, specialty, songs registered, status
- Approve/Reject/Edit actions
- Bulk approve option

**3.6 Schedule/Lineup Editor** (`/host/jams/:id/schedule`)
- Visual schedule of performance with musicians assigned
- For each song slot: specialty, assigned musician, status
- Swap/reassign musician buttons
- Mark as complete button
- Drag & drop to reorder songs
- Drag & drop to reassign musicians
- Add/Remove musician buttons

**3.7 Live Event Control** (`/host/jams/:id/live`)
- Real-time jam control during event
- Current song display (large, prominent)
- Status controls: Start Song, End Song, Skip Song
- Next song preview
- Current musicians on stage
- Pause/Resume buttons

**3.8 Real-time Dashboard View** (`/host/jams/:id/audience-view`)
- View the public dashboard as host
- See what audience sees
- Full-screen option

**3.9 Jam Analytics/Results** (`/host/jams/:id/analytics`)
- Total musicians participated
- Total songs performed
- Performance duration
- Songs list with musicians who played
- Musician participation summary
- Charts/statistics
- Export results option

**3.10 Share Jam Link** (`/host/jams/:id/share`)
- Copy link button
- QR code display and download
- Social media share buttons
- Email invite
- Analytics: views, registrations from link

---

### 4. Authentication Screens

**4.1 Login Page** (`/login`)
- Email and password form
- "Forgot password?" link
- "Sign up" link
- Remember me checkbox

**4.2 Registration Page** (`/register`)
- Choose role: Musician or Host
- Role-specific fields

**4.3 Role Switcher** (`/role-switch`)
- Switch between roles (if user has multiple)

---

### 5. Routes Structure Summary

**Public Routes:**
```
/                    Landing page
/login              Login
/register           Register
/jams               Browse jams
/jams/:id           Jam detail
/public/jam/:id     Public dashboard
```

**Musician Routes:**
```
/profile                    Profile
/register                   Register for jam (with context from jam page)
/my-registrations          My registrations
/my-performances           My schedule
/jams/:id/my-status        Participation status in jam
```

**Host Routes:**
```
/host/dashboard              Host dashboard
/host/create-jam             Create jam
/host/jams/:id/edit          Edit jam
/host/jams/:id/manage        Jam management hub
/host/jams/:id/songs         Songs management
/host/jams/:id/registrations Registrations management
/host/jams/:id/schedule      Schedule editor
/host/jams/:id/live          Live event control
/host/jams/:id/analytics     Analytics
/host/jams/:id/share         Share jam
/host/jams/:id/audience-view View as public
```

---

### Build Priority (MVP)

**Phase 1: Core**
1. Landing page
2. Authentication (login/register)
   - Global registration (`/register`)
   - Jam-specific registration with context (`/jams/:id/register`)
3. Jam Detail page with registration entry point
4. Host: Create jam
5. Host: Manage songs
6. Host: Approve/Reject registrations
7. Public dashboard (real-time display)

**Phase 2: Essential Features**
8. Host: Live event control
9. Musician: My registrations
10. Musician: My performance schedule
11. Musician: Profile
12. Jam Participation Status page

**Phase 3: Nice to Have**
13. Jam analytics
14. Share jam with links/QR
15. Browse jams page
16. Host dashboard with multiple jams

---

### Key Design Considerations

- **Real-time Updates**: Use WebSocket/Socket.IO for live updates
- **Responsive Design**: Mobile-first for musicians on phones
- **Large Display**: Public dashboard optimized for projector/big screens
- **Accessibility**: Follow a11y guidelines
- **Autumn Theme**: Use daisyUI with autumn colors
- **Performance**: Optimize for real-time performance with many simultaneous users

