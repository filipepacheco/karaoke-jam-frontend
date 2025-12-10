## Plan: Schedule & Registration Management (inside Jam Management Hub)

**Summary**: Enhance the Schedule Tab in the Jam Management Hub to provide comprehensive management of performance schedules with nested registrations. Hosts can approve/reject musician registrations within each schedule, reorder the performance queue, control song status (start/end), and manage the entire event flow - matching the view structure from the public Jam Detail Page but with management controls.

### Key Requirements (from project-requirements.txt)

**For the Host:**
- Approve or reject musician registrations for each song role
- Change the order of songs in the queue at any time during the event
- Start and end songs, with immediate updates for all users
- Change the musician schedule even during a Jam

### Key Features

1. **Schedule Display (same as JamDetailPage)**
   - Show schedules ordered by `order` field
   - Each schedule shows: order number, song (title/artist/duration), status badge
   - Nested registrations inside each schedule (musicians registered for that song)
   - Visual highlight for IN_PROGRESS schedule (currently playing)

2. **Registration Management (nested inside schedules)**
   - Display musicians registered for each schedule/song
   - Show registration status: PENDING, APPROVED, REJECTED
   - **Approve button** → approve musician for that song slot
   - **Reject button** → reject/remove registration (DELETE /inscricoes/:id)
   - Show musician name, instrument, level

3. **Schedule Reordering**
   - Move up/down arrow buttons (▲/▼) for each schedule entry
   - Reorder via API: PUT `/escalas/jam/:jamId/reorder` with array of schedule IDs
   - Real-time update of order numbers after reorder

4. **Schedule Status Controls (Start/End Songs)**
   - **Start** button → set status to IN_PROGRESS (only one at a time)
   - **Complete** button → set status to COMPLETED
   - **Cancel** button → set status to CANCELED
   - **Reschedule** button → set CANCELED back to SCHEDULED

5. **Add New Schedule Entry**
   - Select song from jam's repertoire (jamsmusics)
   - Auto-assign next order number
   - Default status: SCHEDULED
   - Modal form for adding

6. **Delete Schedule Entry**
   - Remove schedule with confirmation
   - Cascading effect on nested registrations

### Data Structure (from swagger.json)

**ScheduleResponseDto:**
- id, jamId, musicId, order, status, createdAt
- registrationId (optional)
- music: { id, titulo, artista, genero, duracao }
- registrations: array of registrations for this schedule

**RegistrationResponseDto:**
- id, musicianId, jamId, jamMusicId, status, createdAt
- musician: { id, nome, instrumento, nivel, contato }

### API Endpoints

**Schedules:**
- POST `/escalas` - Create schedule (jamId, musicId, registrationId, order, status)
- PATCH `/escalas/:id` - Update schedule (status, order)
- DELETE `/escalas/:id` - Remove schedule
- PUT `/escalas/jam/:jamId/reorder` - Reorder schedules (array of schedule IDs)

**Registrations:**
- POST `/inscricoes` - Create registration
- DELETE `/inscricoes/:id` - Cancel/reject registration
- Note: No PATCH endpoint for registrations in swagger - approve/reject may need backend update

### Steps

1. **Update scheduleService** (`src/services/scheduleService.ts`)
   - Verify all CRUD operations are implemented
   - Verify reorder function works with PUT method

2. **Add service imports to JamManagementPage**
   - Import scheduleService for schedule operations
   - Import registrationService for registration operations

3. **Create enhanced ScheduleTab component**
   - Display schedules with nested registrations (same layout as JamDetailPage)
   - Add reorder buttons (▲/▼) for each schedule
   - Add status control buttons (Start/Complete/Cancel)
   - Add delete button with confirmation

4. **Implement registration management within schedules**
   - Show registrations nested inside each schedule card
   - Add Approve/Reject buttons for PENDING registrations
   - Color-coded status badges (PENDING=warning, APPROVED=success, REJECTED=error)
   - Handle reject via DELETE /inscricoes/:id

5. **Implement Add Schedule modal**
   - Dropdown to select song from jam.jamsmusics
   - Auto-calculate next order number
   - Save button calls POST /escalas

6. **Implement reorder functionality**
   - Move up: swap with previous schedule
   - Move down: swap with next schedule
   - Call PUT /escalas/jam/:jamId/reorder with new ID array
   - Reload jam data after reorder

### UI Layout (matching JamDetailPage structure)

```
┌─ Schedule Tab ────────────────────────────────────────────┐
│ 📋 Performance Schedule                    [+ Add Entry]   │
├────────────────────────────────────────────────────────────┤
│                                                            │
│ ┌─ Schedule Card ────────────────────────────────────────┐│
│ │ [▲][▼] │ 1 │ "Bluesette" - Toots Thielemans           ││
│ │        │   │ ⏱️ 4:30                    [SCHEDULED]    ││
│ │        │   │                                           ││
│ │        │   │ [▶️ Start] [🗑️ Delete]                    ││
│ │        │   ├───────────────────────────────────────────││
│ │        │   │ 👥 Musicians Registered:                  ││
│ │        │   │ ┌────────────────────────────────────────┐││
│ │        │   │ │ John Doe (Guitar)     [PENDING] [✓][✕] │││
│ │        │   │ │ Jane Smith (Vocals)   [APPROVED]       │││
│ │        │   │ └────────────────────────────────────────┘││
│ └────────────────────────────────────────────────────────┘│
│                                                            │
│ ┌─ Schedule Card (IN_PROGRESS) ──────────────────────────┐│
│ │ [▲][▼] │ 2 │ "All The Things You Are" - Jerome Kern   ││
│ │        │   │ ⏱️ 5:00              [IN_PROGRESS] 🎵     ││
│ │        │   │                                           ││
│ │        │   │ [✓ Complete] [✕ Cancel] [🗑️ Delete]       ││
│ │        │   ├───────────────────────────────────────────││
│ │        │   │ 👥 Musicians:                             ││
│ │        │   │ │ Mike Johnson (Bass)   [APPROVED]       │││
│ └────────────────────────────────────────────────────────┘│
│                                                            │
│ [Empty state if no schedules]                              │
└────────────────────────────────────────────────────────────┘

┌─ Add Schedule Modal ───────────────────────────────────────┐
│ Add Performance Entry                                      │
│                                                            │
│ Song *        [Dropdown: jam songs from jamsmusics]        │
│ Order         [Auto: next number, editable]                │
│                                                            │
│              [Cancel] [Add to Schedule]                    │
└────────────────────────────────────────────────────────────┘
```

### Registration Status Flow
```
PENDING → APPROVED (Host approves)
PENDING → REJECTED/Deleted (Host rejects via DELETE)
```

### Schedule Status Flow
```
SCHEDULED → IN_PROGRESS (Host starts song)
IN_PROGRESS → COMPLETED (Host ends song)
IN_PROGRESS → CANCELED (Host cancels)
CANCELED → SCHEDULED (Host reschedules)
```

### Files to Create/Modify
- `src/pages/JamManagementPage.tsx` - Enhance ScheduleTab component with full management
- `src/services/scheduleService.ts` - Verify reorder function exists
- `src/services/registrationService.ts` - Already has remove() for rejecting

### Further Considerations
1. **Backend PATCH for registrations**: Swagger doesn't show PATCH /inscricoes/:id - approve may need backend update or workaround
2. **Single IN_PROGRESS**: Should starting a new song auto-complete the previous one?
3. **Real-time updates**: Socket integration for live updates (future enhancement)
4. **Slot limits**: Should we enforce slot limits per specialty when approving?
5. **Registration assignment**: Currently registrations are per jamMusic, may need to link to specific schedule

