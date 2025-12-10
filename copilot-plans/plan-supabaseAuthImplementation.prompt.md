# Plan: Supabase Authentication with Backend Integration (Option A)

## TL;DR
Integrate Supabase Auth as the primary authentication layer. After Supabase login/signup:
1. Exchange Supabase token for backend API access
2. Auto-create/sync musician profile in backend
3. All users start as 'guest' role (host role assigned manually/internally)
4. Prompt users to select favorite instrument & genre after first social login
5. Use Supabase token for all subsequent API calls

## Steps

### 1. Setup Supabase Configuration (`src/lib/supabase/config.ts`)
- Create Supabase client instance with VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY
- Configure auth persistence to localStorage
- Export configured client for reuse

### 2. Create Supabase Auth Service (`src/lib/supabase/authService.ts`)
- `signUpWithEmail(email, password, metadata)` - Register with email
- `signInWithEmail(email, password)` - Login with email
- `signInWithOAuth(provider: 'google'|'github'|'discord'|'spotify')` - Social login
- `signOut()` - Logout and clear session
- `getCurrentSession()` - Get active Supabase session
- `resetPassword(email)` - Password recovery flow

### 3. Create Backend Sync Service (`src/services/backendAuthService.ts`)
- `syncSupabaseUserToBackend(supabaseUser, supabaseToken)` - Create/update musician in backend
- Link `musician.supabaseUserId` to Supabase auth user
- Store Supabase token in backend session/JWT for API calls
- Detect if user is new (return `isNewUser: true`)

### 4. Update AuthContext (`src/contexts/AuthContext.tsx`)
- Initialize from Supabase session (not just localStorage)
- On mount: Check Supabase session → Sync to backend → Update AuthContext
- Listen to Supabase auth state changes (auto re-sync on token refresh)
- Store both Supabase token + backend session token
- Set all users to `role: 'guest'` initially

### 5. Refactor LoginPage (`src/pages/LoginPage.tsx`)
- Email/password login section
- Social login buttons (Google, GitHub, Discord, Spotify)
- OAuth callback handling
- Maintain smart redirect logic (with `?redirect=` param support)

### 6. Create Instrument/Genre Selection Modal (`src/components/OnboardingModal.tsx`)
- Show ONLY on first login (`isNewUser: true`)
- Dropdown for favorite instrument (from instrument list)
- Dropdown for favorite genre (from GENRES)
- Submit updates musician profile in backend
- Auto-close after submission, continue to redirect destination

### 7. Add Auth Callback Route (`src/pages/AuthCallbackPage.tsx`)
- Route: `/auth/callback`
- Handle Supabase OAuth redirect
- Exchange auth code for session
- Redirect to intent or home

### 8. Update API Client (`src/lib/api/client.ts`)
- All API calls include `Authorization: Bearer {supabaseToken}`
- Backend validates Supabase token matches user
- Fallback to backend session if Supabase token expired

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                         │
├─────────────────────────────────────────────────────────────────┤
│  LoginPage / Social Buttons                                      │
│       ↓                                                           │
│  Supabase Auth (signInWithOAuth or signInWithEmail)             │
│       ↓                                                           │
│  Get Supabase Session + User Data                               │
│       ↓                                                           │
│  Call backendAuthService.syncSupabaseUserToBackend()            │
│       ↓                                                           │
│  Detect isNewUser → Show OnboardingModal (instrument/genre)     │
│       ↓                                                           │
│  Save to AuthContext (role='guest', supabaseToken, user data)   │
│       ↓                                                           │
│  Redirect to intended destination                               │
└─────────────────────────────────────────────────────────────────┘
          │
          │ API calls with Supabase token
          ↓
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (Node.js/Java/etc)                    │
├─────────────────────────────────────────────────────────────────┤
│  POST /auth/sync-user                                           │
│  - Verify Supabase token (validate JWT)                         │
│  - Extract supabaseUserId from token                            │
│  - Find or create musician with supabaseUserId                  │
│  - Return musician data + backend session token                 │
│       ↓                                                           │
│  Subsequent API calls (GET /jams, POST /registrations, etc)     │
│  - Verify Supabase token in Authorization header               │
│  - Look up musician by supabaseUserId                           │
│  - Allow access (role='guest' can browse, register, suggest)    │
└─────────────────────────────────────────────────────────────────┘
          │
          ↓
┌─────────────────────────────────────────────────────────────────┐
│                    SUPABASE (Auth Service)                       │
├─────────────────────────────────────────────────────────────────┤
│  Manages: Email/password, OAuth (Google, GitHub, Discord)       │
│  Returns: Session + JWT token + User metadata                   │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow - First Time User (Social Login)

```
1. User clicks "Login with Google"
   ↓
2. Supabase redirects to Google OAuth
   ↓
3. User authenticates with Google account
   ↓
4. Google redirects back to /auth/callback with auth code
   ↓
5. Supabase exchanges code for session (JWT token + user data)
   ↓
6. Frontend calls: backendAuthService.syncSupabaseUserToBackend(supabaseSession)
   ↓
7. Backend:
   - Validates Supabase token signature
   - Extracts supabaseUserId from token
   - Creates NEW musician record with:
     * supabaseUserId = "google|12345..."
     * name = "John Doe" (from Google profile)
     * email = "john@google.com"
     * role = 'guest' (default)
     * instrument = null (user hasn't selected yet)
     * genre = null (user hasn't selected yet)
   - Returns { musician, isNewUser: true }
   ↓
8. Frontend sees isNewUser=true
   - Shows OnboardingModal
   - User selects instrument + genre
   - Submits to backend: PATCH /musicians/{id} { instrument, genre }
   ↓
9. OnboardingModal closes
   ↓
10. Redirect to ?redirect= param or /jams
    User is now fully onboarded!
```

## User Role Model

```
Initial State (All New Users)
├── role = 'guest'
├── Can view jams
├── Can register for jams
├── Can suggest songs
├── CANNOT approve songs
├── CANNOT create jams
└── CANNOT manage anything

When Promoted to 'host' (Manual/Internal)
├── role = 'host'
├── All guest permissions PLUS:
├── Can create jams
├── Can manage own jams
├── Can approve/reject song suggestions
└── Can edit approved songs
```

## Environment Variables to Update

```env
# Current (incomplete)
VITE_API_URL=http://localhost:3000
supabase=pDMLeRotpIyvr5T0

# Required additions:
VITE_SUPABASE_URL=https://[your-project].supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

## Social Providers to Enable (Recommended Order)

### Phase 1 (MVP)
- **Google** - ~40% user base covers
- **Email/Password** - Backup option for others

### Phase 2
- **GitHub** - Developer/musician friendly, quick setup

### Phase 3
- **Discord** - Community-engaged users
- **Spotify** - Musicians/music fans

## Further Considerations

### 1. Supabase Project Setup
- Need VITE_SUPABASE_URL from Supabase dashboard
- Need VITE_SUPABASE_ANON_KEY from Auth settings
- Configure OAuth apps in Supabase → Authentication → Providers

### 2. Backend Changes Required
- New column: `musician.supabaseUserId` (unique, string)
- Backend middleware to validate Supabase JWT tokens
- New endpoint: `POST /auth/sync-user` (Supabase user → backend musician)
- Update existing endpoints to accept Supabase token in Authorization header

### 3. Instrument & Genre Selection
- Use existing GENRES from musicConstants
- Create INSTRUMENTS list if not exists
- Should instrument selection be required or optional?

### 4. Session/Token Management
- Supabase tokens auto-refresh (handled by SDK)
- How long should Supabase session persist? (default: 1 week)
- Should users have "Remember Me" option?

### 5. Email Verification (Optional)
- Supabase can send confirmation emails
- Should email be verified before access? (recommend: optional, prompt later)

### 6. Password Reset Flow
- User clicks "Forgot Password"
- Enter email → Supabase sends reset link
- User clicks link → Reset password in Supabase
- Auto-login after reset

## Files to Create/Modify

### New Files
- `src/lib/supabase/config.ts` - Supabase client setup
- `src/lib/supabase/authService.ts` - Supabase auth methods
- `src/services/backendAuthService.ts` - Backend sync logic
- `src/components/OnboardingModal.tsx` - Instrument/genre selection
- `src/pages/AuthCallbackPage.tsx` - OAuth callback handler
- `src/lib/instruments.ts` - Instruments list (if needed)

### Modified Files
- `.env` - Add Supabase credentials
- `src/contexts/AuthContext.tsx` - Update to use Supabase + backend
- `src/pages/LoginPage.tsx` - Add social login buttons
- `src/lib/api/client.ts` - Add Supabase token to API headers
- `src/components/index.ts` - Export OnboardingModal
- `src/types/auth.types.ts` - Add supabaseUserId, isNewUser fields

## Implementation Checklist

- [x] Step 1: Setup Supabase Configuration
- [x] Step 2: Create Supabase Auth Service
- [x] Step 3: Create Backend Sync Service
- [x] Step 4: Update AuthContext
- [x] Step 5: Refactor LoginPage
- [x] Step 6: Create OnboardingModal
- [x] Step 7: Add Auth Callback Route
- [x] Step 8: Update API Client
- [x] Backend: Add supabaseUserId column to musicians table
- [x] Backend: Create POST /auth/sync-user endpoint
- [x] Backend: Add JWT validation middleware
- [ ] Setup Supabase OAuth providers (Google + GitHub)
- [ ] Test email/password flow
- [ ] Test social login flow (Google)
- [ ] Test onboarding flow
- [ ] Test redirect after login

