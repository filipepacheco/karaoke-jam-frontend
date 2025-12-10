## Plan: Simplified Authentication Flow Implementation
This plan outlines the simplified authentication flow for the Jam Session app. Users login with email or phone number - if they exist in the database, they're logged in as a musician; if not, a new musician account is automatically created and started.
### Phase 1: Backend API Setup (Prerequisites)
**Step 1.1: Define Authentication API Endpoints**
- POST `/auth/login` - Login or auto-register with email OR phone
  - Request: `{ email?: string, phone?: string }`
  - Response: `{ userId, name, email, phone, role: 'user', token }`
- GET `/auth/logout` - Logout user
- GET `/jams/:id` - Get jam details with required specialties
**Step 1.2: Backend Logic**
- Login endpoint receives email OR phone (not both)
- Query database: does user exist with that email/phone?
  - If YES: return user data + JWT token (login successful)
  - If NO: create new musician with auto-generated name, return user data + JWT token (auto-register)
- All users created via login have role: 'user' (musician)
- Default values for new accounts:
  - name: auto-generated from email or phone number
  - role: 'user' (always musician)
  - specialty: null (to be filled in during jam registration)
  - level: null (to be filled in during jam registration)
**Step 1.3: Backend Response Format**
- Success: `{ userId, name, email, phone, role: 'user', token, isNewUser: boolean }`
- Error: `{ statusCode, error, message }`
---
### Phase 2: Frontend Setup
**Step 2.1: Create Auth Service** (`src/services/authService.ts`)
- `loginOrRegister(email?: string, phone?: string)` - Single function for both login and auto-register
  - Calls POST `/auth/login` with email or phone
  - Returns user data and token
  - Handles both existing user login and new user auto-creation
- `logout()` - Clear auth and logout
- Error handling for network, validation, and server errors
**Step 2.2: Create Jam Service** (`src/services/jamService.ts`)
- `getJamDetails(jamId)` - Get jam info with specialties needed, available slots
- Error handling
---
### Phase 3: Pages Implementation
**Step 3.1: Login Page** (`src/pages/LoginPage.tsx`)
- Simple form with single input field
- Input field: "Email or Phone Number"
- Submit button: "Continue"
- Helpful text explaining what to enter
- Integration with AuthContext via useAuth hook
- On success: redirect to jam browser or home
- Test accessible at: `?login=true`
**Step 3.2: Jam Detail Page** (`src/pages/JamDetailPage.tsx`)
- Display jam information
- List songs in jam
- List registered musicians
- Performance schedule/lineup
- "Register/Join This Jam" button (links to `/jams/:id/register`)
- If user already registered for this jam: show registration status
**Step 3.3: Jam Registration Page** (`src/pages/JamRegisterPage.tsx`)
- Get jamId from URL params (`/jams/:id/register`)
- Fetch jam details using jamService
- Display jam context at top:
  - Jam name and date
  - Host name
  - Required specialties with slot counts (e.g., "2 vocals, 1 guitar")
  - Available slots remaining per specialty
- Registration form with:
  - Specialty/Instrument field (required, pre-selected with most needed specialty)
  - Level field (optional: beginner, intermediate, advanced, professional)
  - Confirmation checkbox: "I understand my registration is pending host approval"
- Actions:
  - "Join This Jam" button
  - "Continue as Viewer" link (skip registration)
  - "Back to Jam" button
- Post-registration confirmation screen with redirect options
---
### Phase 4: Components
**Step 4.1: Login Form Component** (`src/components/forms/SimpleLoginForm.tsx`)
- Single input field with placeholder: "Email or Phone Number"
- Input accepts: valid email format OR 10+ digit phone
- Client-side validation before submit
- Submit button with loading state
- Error alert for invalid format or server errors
- Clear, helpful instructions for user
**Step 4.2: Jam Registration Form** (`src/components/forms/JamRegistrationForm.tsx`)
- Jam context display at top (using separate component)
- Specialty/Instrument dropdown (required, pre-selected)
- Level dropdown (optional)
- Confirmation checkbox
- "Join This Jam" submit button
- Loading state during submission
- Error alerts
- "Back to Jam" button
**Step 4.3: Jam Context Display Component** (`src/components/JamContextDisplay.tsx`)
- Jam name and date
- Host name
- Required specialties with slot counts
- Available slots per specialty
- Clean, easy-to-read layout
- Responsive design for mobile
---
### Phase 5: Integration
**Step 5.1: Update AuthContext** (`src/contexts/AuthContext.tsx`)
- Update login() method to call authService.loginOrRegister()
- Remove password from login (not needed)
- Set role to 'user' automatically for all login users
- Keep viewer as default for non-authenticated users
- Handle real API responses and token management
- Update localStorage to store new user data format
**Step 5.2: Create Auth Routes**
- Public routes: `/login`, `/`, `/jams`, `/jams/:id`, `/public/jam/:id`
- Protected routes: `/profile`, `/my-registrations`, `/my-performances` (UserOnly guard)
- Jam registration routes: `/jams/:id/register` (UserOnly guard)
- Redirect logic:
  - Non-authenticated user accessing protected route → redirect to /login
  - Authenticated user on /login → redirect to jam browser or home
  - User not authenticated on /jams/:id/register → redirect to /login first
**Step 5.3: Update Navbar** (`src/components/Navbar.tsx`)
- If not authenticated: show "Login" button linking to /login
- If authenticated: show user name and "Logout" button
- Show role badge (should always show 'user' or 'viewer')
---
### Phase 6: User Flows
**Flow 1: New User - First Login**
```
User navigates to /login
  ↓
Enters email or phone
  ↓
Clicks "Continue"
  ↓
LoginForm validates input
  ↓
authService.loginOrRegister(email or phone) called
  ↓
POST /auth/login sent to backend
  ↓
Backend: User doesn't exist → creates new musician
  ↓
Backend returns: { userId, name, email, phone, role: 'user', token }
  ↓
AuthContext.login() stores user + token in state + localStorage
  ↓
Redirect to jam browser or home page
```
**Flow 2: Existing User - Login**
```
User navigates to /login
  ↓
Enters email or phone
  ↓
Clicks "Continue"
  ↓
LoginForm validates input
  ↓
authService.loginOrRegister(email or phone) called
  ↓
POST /auth/login sent to backend
  ↓
Backend: User exists → returns existing musician
  ↓
Backend returns: { userId, name, email, phone, role: 'user', token }
  ↓
AuthContext.login() stores user + token
  ↓
Redirect to jam browser or home
```
**Flow 3: Join Jam - With Auto-Login**
```
User clicks "Register/Join This Jam" on jam detail
  ↓
If authenticated: go to /jams/:id/register
  ↓
If not authenticated:
  → Redirect to /login
  → User logs in (goes through Flow 1 or 2)
  → Redirect back to /jams/:id/register
  ↓
Display jam context and registration form
  ↓
User selects specialty and level
  ↓
Clicks "Join This Jam"
  ↓
Form submits registration to backend
  ↓
Show confirmation: "Your registration is pending host approval"
  ↓
Options: view public dashboard, back to jam, or go home
```
---
### Implementation Order (Recommended)
1. **Backend First**: Implement single `/auth/login` endpoint with auto-register logic
2. **Auth Service**: Create `authService.ts` with `loginOrRegister()` function
3. **Update AuthContext**: Connect to service, remove password/role selection
4. **Login Page**: Build simple email/phone login form
5. **Login Testing**: Test login/auto-register flow
6. **Jam Detail Page**: Add jam information display
7. **Jam Registration Form**: Build registration with jam context
8. **Jam Service**: Implement jam details fetching
9. **Route Guards**: Implement UserOnly guard redirecting to login
10. **Navigation**: Add login/logout in navbar
11. **Error Handling**: Comprehensive error messages
12. **Final Testing**: Test complete user flows
---
### Files to Create/Modify
**New Files:**
- `src/services/authService.ts` - Simplified auth service (1 main function)
- `src/services/jamService.ts` - Jam details service
- `src/pages/LoginPage.tsx` - Simple login page
- `src/pages/JamDetailPage.tsx` - Jam detail display
- `src/pages/JamRegisterPage.tsx` - Jam registration page
- `src/components/forms/SimpleLoginForm.tsx` - Email/phone input form
- `src/components/forms/JamRegistrationForm.tsx` - Jam registration form
- `src/components/JamContextDisplay.tsx` - Jam context component
**Modify:**
- `src/contexts/AuthContext.tsx` - Integrate authService, simplify login
- `src/App.tsx` - Add new routes, login redirect logic
- `src/components/Navbar.tsx` - Add login/logout buttons
- `src/types/auth.types.ts` - Update AuthUser to match backend response
---
### Key Simplifications from Original Plan
1. **One Endpoint**: Single `/auth/login` handles both login and auto-register
2. **No Password**: Email or phone is sufficient for authentication
3. **No Role Selection**: All users automatically become musicians
4. **No Separate Registration**: New users auto-created on first login
5. **Single Input Form**: Only email or phone field needed
6. **Automatic Account Creation**: Backend creates account if doesn't exist
7. **Simplified Service**: One `loginOrRegister()` function instead of multiple
8. **No Role Switching**: Users stay as musicians (viewers are unauthenticated only)
---
### Input Validation
**Login Form Validation:**
- Email: accepts valid email format (user@example.com)
- Phone: accepts 10+ digits (removes formatting, keeps digits only)
- At least one provided (either email or phone)
- Client-side validation before API call
**Jam Registration Validation:**
- Specialty: required, must be one of jam's needed specialties
- Level: optional, if provided must be valid
- Confirmation checkbox: must be checked to submit
---
### Error Handling
Use existing error handling system:
- Import `ErrorAlert` component
- Use `formatError()` utility for user messages
- Specific errors:
  - Invalid email/phone format: "Please enter a valid email or phone number"
  - Network error: "Connection error. Please try again."
  - Server error: "An error occurred. Please try again later."
  - Registration failure: Show backend error message
---
### Post-Login Behavior
**On Successful Login:**
- Store user + token in AuthContext and localStorage
- Set role to 'user' (musician)
- Redirect to:
  - Jam browser (if coming from login page)
  - Back to jam detail (if coming from jam redirect)
  - Home page (default)
**On Logout:**
- Clear user + token from AuthContext and localStorage
- Reset role to 'viewer'
- Redirect to home page or login page
---
### Timeline & Dependencies
- **Backend `/auth/login` endpoint**: Must be ready first
- **Auth service**: Can build in parallel with login page
- **Login page**: Foundation, build early
- **AuthContext integration**: After service ready
- **Jam pages**: After login working
- **Testing**: Continuous throughout
