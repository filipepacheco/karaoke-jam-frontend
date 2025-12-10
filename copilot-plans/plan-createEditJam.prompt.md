## Plan: Create/Edit Jam (`/host/create-jam`, `/host/jams/:id/edit`)

**Summary**: Create a unified form component for creating new jams and editing existing ones. The form will handle jam details (name, date/time, description, location, contact info), with validation, error handling, and automatic QR code generation/display.

### Key Features

1. **Unified Form for Create & Edit**
   - Same form component used for both creating and editing
   - In create mode: empty form with defaults
   - In edit mode: pre-filled form with existing jam data
   - Route parameter detection: `/host/create-jam` vs `/host/jams/:id/edit`

2. **Form Fields** (from CreateJamDto in swagger)
   - **Name** (required, string) - Jam session name
   - **Date** (optional, datetime) - Jam session date and time
   - **Time** (optional, time) - Separate time picker for convenience
   - **Description** (optional, string) - Jam session description (textarea)
   - **Location** (required, string) - Jam session location
   - **Host Name** (required, string) - Host name (auto-filled from auth context)
   - **Host Contact** (required, string) - Host contact (auto-filled from auth context)
   - **Status** (optional, select) - Enum: ACTIVE, INACTIVE, FINISHED

3. **QR Code Features**
   - Display QR code if jam is created/updated
   - QR code represents jam URL or join link
   - "Download QR Code" button to save as image
   - "Copy Share Link" button for jam URL

4. **Form Validation**
   - Client-side validation before submission
   - Server-side error handling and display
   - Field-level error messages
   - Required field indicators

5. **Actions**
   - "Save Jam" button (primary, creates/updates)
   - "Cancel" button (navigates back to dashboard)
   - "Delete Jam" button (edit mode only, with confirmation)
   - Success notification after save

### Steps

1. **Create CreateJamPage component** at `src/pages/CreateJamPage.tsx`
   - Detect mode (create vs edit) from route
   - Load jam data if in edit mode
   - Initialize form state with defaults or loaded data
   - Auto-fill hostName and hostContact from auth context

2. **Build jam form component**
   - Form fields: name, date, time, description, location, hostName, hostContact, status
   - Input validation (required fields, format validation)
   - Error state display
   - Loading state during submission

3. **Implement form submission**
   - Combine date + time if separate
   - Call `jamService.create()` for new jams
   - Call `jamService.update()` for existing jams (need to implement)
   - Handle errors and show error messages
   - Show success notification
   - Redirect to `/host/dashboard` on success

4. **Add QR code generation**
   - Generate QR code from jam share URL after creation
   - Display QR code in modal or dedicated section
   - Provide download and copy-to-clipboard options
   - Use library: `qrcode.react`

5. **Add routing**
   - Route: `/host/create-jam` - Create mode
   - Route: `/host/jams/:id/edit` - Edit mode
   - Add route guards to ensure only authenticated users access
   - Update App.tsx with new routes

6. **Implement edit mode features**
   - Load jam data using `jamService.findOne(jamId)`
   - Pre-fill form with loaded data
   - Show "Delete Jam" button with confirmation
   - Handle delete action with redirect to dashboard

7. **Form UX improvements** (optional for MVP)
   - Combine date and time inputs into single datetime picker
   - Auto-fill host info from auth context
   - Show "Preview" of jam details before saving
   - Unsaved changes confirmation before leaving page

### Data Requirements

From backend API:
- **POST /jams** - Create new jam with CreateJamDto
- **GET /jams/:id** - Fetch jam details for editing
- **PATCH /jams/:id** - Update jam details
- **DELETE /jams/:id** - Delete jam (already implemented in jamService)
- Current user info from auth context (name, email/contact)

### Components Needed
- `CreateJamPage.tsx` - Main page component handling both create and edit modes
- Form fields using daisyUI components (input, textarea, select, datetime)
- QR code display component (optional separate component)

### Form Structure
```
┌─ Header ──────────────────────────────────────┐
│  Create New Jam    (or "Edit Jam Name")        │
└────────────────────────────────────────────────┘

┌─ Form ────────────────────────────────────────┐
│ Jam Name *                                     │
│ [_________________________________]            │
│                                                │
│ Description                                    │
│ [_________________________________]            │
│ [_________________________________]            │
│ [_________________________________]            │
│                                                │
│ Date * | Time                                  │
│ [____________] | [_______]                     │
│                                                │
│ Location *                                     │
│ [_________________________________]            │
│                                                │
│ Host Name * | Host Contact *                   │
│ [____________] | [____________]                │
│                                                │
│ Status                                         │
│ [Dropdown: ACTIVE / INACTIVE / FINISHED]       │
│                                                │
│ [Save Jam] [Cancel] [Delete] (if edit mode)    │
└────────────────────────────────────────────────┘

[After Save]
┌─ QR Code Modal ───────────────────────────────┐
│  Jam Created Successfully!                     │
│                                                │
│  Share this jam:                               │
│  [QR Code Image]                               │
│                                                │
│  [Download QR] [Copy Link] [Close]             │
└────────────────────────────────────────────────┘
```

### API Integration Points
- **Create**: POST /jams with CreateJamDto
- **Edit**: GET /jams/:id (load), PATCH /jams/:id (update)
- **Delete**: DELETE /jams/:id (from jamService.deleteFn)

### Files to Create/Modify
- `src/pages/CreateJamPage.tsx` - New page component
- `src/App.tsx` - Add routes `/host/create-jam` and `/host/jams/:id/edit`
- `src/services/jamService.ts` - May need to add `update()` function if not exists
- `package.json` - May need to add QR code library (e.g., `qrcode.react`)

### Further Considerations
1. **Date/Time Input**: Should we use separate date and time fields or combined datetime picker?
2. **QR Code Library**: Which library to use? (`qrcode.react`, `qr-code-styling`, etc.)
3. **Datetime Format**: Should we convert between local and UTC? How to handle timezones?
4. **Host Auto-fill**: Should host name and contact always be from auth context, or allow editing?
5. **Status Field**: Should only hosts be able to change jam status, or is it auto-managed?
6. **Jam URL**: What's the exact format for the share link that goes in QR code? (`/jams/:id`, `/join/:code`, etc.)

