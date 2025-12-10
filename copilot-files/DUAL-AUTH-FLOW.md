# Supabase Integration: Dual Auth Flow

## Overview

The frontend now supports TWO authentication flows:

### Flow 1: Old Backend Auth (Simple Login Form)
```
User enters email/phone
    ↓
POST /auth/login { email or phone }
    ↓
Backend creates/finds musician
    ↓
Returns: { userId, name, token, isNewUser }
    ↓
Frontend stores backend JWT token
```

**When to use**: When Supabase is not configured or for phone-based login

**Files involved**:
- `src/components/forms/SimpleLoginForm.tsx`
- `src/services/authService.ts` (loginOrRegister)

---

### Flow 2: Supabase Auth (Supabase Login Form)
```
User chooses: Email/Password or OAuth (Google, GitHub)
    ↓
Supabase Auth (signInWithEmail or signInWithOAuth)
    ↓
Supabase returns session { access_token, user }
    ↓
Frontend calls POST /auth/sync-user
    ├─ Request body: { token: supabaseAccessToken }
    ├─ Backend validates Supabase token
    ├─ Backend creates/finds musician with supabaseUserId
    └─ Returns: { userId, name, token, isNewUser }
    ↓
Frontend stores backend JWT token
    ↓
If isNewUser=true: Show onboarding modal
```

**When to use**: When Supabase is configured (VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY set)

**Files involved**:
- `src/components/forms/SupabaseLoginForm.tsx`
- `src/services/backendAuthService.ts` (syncSupabaseUserToBackend)
- `src/contexts/AuthContext.tsx` (Supabase integration)
- `src/pages/AuthCallbackPage.tsx` (OAuth callback)

---

## Request/Response Formats

### POST /auth/login (Old Flow)
**Request**:
```json
{
  "email": "user@example.com"
  // OR
  "phone": "+5511999999999"
}
```

**Response** (200):
```json
{
  "userId": "musician-uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+5511999999999",
  "role": "user",
  "token": "backend-jwt-token",
  "isNewUser": true
}
```

---

### POST /auth/sync-user (Supabase Flow)
**Request**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
The token is a **Supabase access token** from the OAuth/email-password authentication.

**Response** (200):
```json
{
  "userId": "musician-uuid",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user",
  "token": "backend-jwt-token",
  "isNewUser": true
}
```

**Error Responses**:
- `400`: Supabase not configured in backend
- `401`: Invalid/expired Supabase token

---

## Frontend Logic (LoginPage.tsx)

```typescript
const useSupabase = isSupabaseConfigured()

// If Supabase is configured, show SupabaseLoginForm
// Otherwise, show SimpleLoginForm (fallback)
{useSupabase ? <SupabaseLoginForm /> : <SimpleLoginForm />}
```

---

## State Management (AuthContext.tsx)

Both flows end up in the same place:
1. `handleAuthSuccess()` is called with session/user data
2. Sync happens (Supabase flow) or directly stores token (old flow)
3. User state is updated
4. Token is stored in localStorage
5. Auth context is updated

```typescript
// After successful login (either flow)
setUser(authUser)
setToken(token)
setIsAuthenticated(true)
setIsNewUser(isNewUser)
```

---

## Environment Configuration

### For Supabase Flow
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

### For Old Flow (always available)
```env
VITE_API_URL=http://localhost:3000
```

---

## Testing Both Flows

### Test Old Flow (Simple Login)
1. Comment out `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env`
2. Restart dev server
3. Go to `/login`
4. Should see "SimpleLoginForm" with email/phone input
5. Enter email/phone
6. Submit to `/auth/login`

### Test Supabase Flow (Email/Password)
1. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env`
2. Restart dev server
3. Go to `/login`
4. Should see "SupabaseLoginForm" with Google/GitHub buttons and email/password fields
5. Enter email and password
6. Submit to Supabase
7. Then POST to `/auth/sync-user` with Supabase token
8. If `isNewUser=true`, onboarding modal appears

### Test OAuth Flow
1. Have Supabase configured
2. Go to `/login`
3. Click "Continue with Google"
4. Redirected to Google login
5. After auth, redirected to `/auth/callback`
6. Callback page syncs with backend via `/auth/sync-user`
7. Redirected to home or intended destination
8. If `isNewUser=true`, onboarding modal appears

---

## Troubleshooting

### "Cannot sync user" / 401 Error
- Check backend has `SUPABASE_JWT_SECRET` environment variable
- Verify Supabase credentials match between frontend and backend
- Check backend logs for JWT validation error

### Onboarding modal not showing
- Check `isNewUser` flag in response from `/auth/sync-user`
- Verify response has `isNewUser: true`

### Redirect after login not working
- Check URL parameters: `?redirect=/path` or `?jamId=id`
- Check browser console for any JavaScript errors
- Verify `AuthCallbackPage` is properly handling OAuth callbacks

### Can't see email/password fields
- Check if Supabase is configured (check browser console)
- If not configured, `SimpleLoginForm` will show instead
- Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env`

