# Role-Based Authentication System - Complete Documentation

**Date**: December 6, 2025  
**Status**: ✅ Implementation Complete

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [User Roles](#user-roles)
4. [Type Definitions](#type-definitions)
5. [Components & Hooks](#components--hooks)
6. [Usage Patterns](#usage-patterns)
7. [Best Practices](#best-practices)
8. [Testing](#testing)
9. [File Structure](#file-structure)
10. [Troubleshooting](#troubleshooting)

---

## Overview

The role-based authentication system provides a complete solution for managing three distinct user roles in the application:
- **Viewer** (Anonymous) - Read-only access to public content
- **User** (Musician) - Can register for jams, view registrations, manage own profile
- **Host** (Organizer) - Can create jams, manage registrations, set schedules

**Key Features:**
- ✅ Context-based state management
- ✅ localStorage persistence across page reloads
- ✅ Route guards for role-based access control
- ✅ Role-aware navigation
- ✅ Permission checking utilities
- ✅ Error handling and fallbacks

---

## Architecture

### Component Hierarchy

```
App (wrapped with AuthProvider)
├── AuthProvider (src/contexts/AuthContext.tsx)
│   ├── AppContent
│   │   ├── Navbar (role-aware)
│   │   ├── ProtectedRoute (conditional rendering)
│   │   └── Pages (role-specific)
│   └── Child components (using useAuth hook)
```

### Data Flow

```
1. App Initialization
   ├── AuthProvider loads from localStorage
   ├── Sets user, role, isAuthenticated state
   └── Sets isLoading to false

2. User Login
   ├── Login with credentials
   ├── Receive token + user data
   ├── Store in localStorage
   └── Update context state

3. Component Rendering
   ├── useAuth() gets current state
   ├── Route guards check permissions
   ├── Conditional rendering based on role
   └── Display role-specific content

4. User Logout
   ├── Clear localStorage
   ├── Reset state to viewer
   └── Redirect to home
```

---

## User Roles

### 1. Viewer (Anonymous)
**Characteristics:**
- No authentication required
- Read-only access to public content
- Default role for new visitors

**Permissions:**
- ✅ View jams
- ✅ View musicians
- ✅ View music
- ✅ View public dashboard
- ❌ Cannot register, create, or edit

**Navigation:**
- Home
- Browse Jams
- Browse Musicians
- Browse Music
- "Join" button in navbar

---

### 2. User (Musician)
**Characteristics:**
- Authenticated musician/performer
- Can register for jam sessions
- Manages own registrations and performances

**Permissions:**
- ✅ All viewer permissions
- ✅ Create profile
- ✅ Register for jams
- ✅ View own registrations
- ✅ View own performances
- ✅ Edit own profile
- ❌ Cannot create/edit jams (host only)

**Navigation:**
- Home, Browse Jams, Musicians, Music
- My Registrations
- My Schedule
- Profile
- Logout button

---

### 3. Host (Organizer)
**Characteristics:**
- Authenticated jam organizer
- Creates and manages jam sessions
- Manages musician registrations

**Permissions:**
- ✅ All user permissions
- ✅ Create jams
- ✅ Edit own jams
- ✅ Delete own jams
- ✅ Manage registrations
- ✅ Set performance schedules
- ✅ View analytics

**Navigation:**
- All user navigation items
- Host Dashboard
- Create Jam button
- Manage Registrations
- Analytics

---

## Type Definitions

### AuthUser

```typescript
interface AuthUser {
  id: string
  name: string
  email: string
  role: 'viewer' | 'user' | 'host'
  
  // Musician-specific
  instrument?: string
  level?: string
  contact?: string
  
  // Host-specific
  hostName?: string
  hostContact?: string
}
```

### AuthContextType

```typescript
interface AuthContextType {
  // State
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  role: UserRole
  
  // Methods
  login: (user: AuthUser, token: string) => void
  logout: () => void
  setRole: (role: UserRole) => void
  updateUser: (fields: Partial<AuthUser>) => void
  
  // Helpers
  isHost: () => boolean
  isUser: () => boolean
  isViewer: () => boolean
}
```

---

## Components & Hooks

### useAuth Hook

Access authentication state and methods in any component.

```typescript
import { useAuth } from '@/hooks'

function MyComponent() {
  const {
    user,                // AuthUser | null
    isAuthenticated,     // boolean
    isLoading,          // boolean
    role,               // 'viewer' | 'user' | 'host'
    login,              // (user, token) => void
    logout,             // () => void
    setRole,            // (role) => void
    updateUser,         // (fields) => void
    isHost,             // () => boolean
    isUser,             // () => boolean
    isViewer,           // () => boolean
  } = useAuth()
}
```

### Route Guard Components

#### ProtectedRoute
Generic guard for any role requirement.

```typescript
import { ProtectedRoute } from '@/components'

<ProtectedRoute requiredRole="host" fallback={<AccessDenied />}>
  <HostDashboard />
</ProtectedRoute>

// Multiple roles
<ProtectedRoute requiredRole={['user', 'host']}>
  <RegistrationForm />
</ProtectedRoute>
```

#### HostOnly
Shorthand for host-only routes.

```typescript
import { HostOnly } from '@/components'

<HostOnly fallback={<NotAHost />}>
  <CreateJamForm />
</HostOnly>
```

#### UserOnly
For authenticated musicians/users.

```typescript
import { UserOnly } from '@/components'

<UserOnly>
  <MyRegistrations />
</UserOnly>
```

#### AuthenticatedOnly
For any authenticated user.

```typescript
import { AuthenticatedOnly } from '@/components'

<AuthenticatedOnly fallback={<LoginPrompt />}>
  <UserProfile />
</AuthenticatedOnly>
```

#### ViewerOnly
For anonymous/viewer access.

```typescript
import { ViewerOnly } from '@/components'

<ViewerOnly>
  <PublicDashboard />
</ViewerOnly>
```

### Permission Check Hooks

#### useCanAccess
Check if user can access a role.

```typescript
import { useCanAccess } from '@/lib/auth/routeGuardHooks'

function AdminPanel() {
  const isAdmin = useCanAccess('host')
  
  if (!isAdmin) {
    return <AccessDenied />
  }
  
  return <AdminContent />
}
```

#### useIsHost, useIsUser, useIsViewer
Quick role checks.

```typescript
import { useIsHost, useIsUser, useIsViewer } from '@/lib/auth/routeGuardHooks'

const isHost = useIsHost()
const isUser = useIsUser()
const isViewer = useIsViewer()
```

---

## Usage Patterns

### Pattern 1: Login Flow

```typescript
import { useAuth } from '@/hooks'
import { formatError } from '@/lib/api'
import type { AuthUser } from '@/types/auth.types'

function LoginForm() {
  const { login } = useAuth()
  const [error, setError] = useState<string | null>(null)
  
  const handleLogin = async (email: string, password: string) => {
    try {
      // Call backend login API
      const response = await authService.login(email, password)
      
      // Create AuthUser object
      const user: AuthUser = {
        id: response.userId,
        name: response.name,
        email: response.email,
        role: response.role,
        ...(response.role === 'user' && {
          instrument: response.instrument,
          level: response.level,
        }),
      }
      
      // Login with context
      login(user, response.token)
      
      // Redirect to dashboard
      navigate(getDefaultRedirectByRole(user.role))
    } catch (err) {
      setError(formatError(err))
    }
  }
}
```

### Pattern 2: Protected Route

```typescript
import { HostOnly } from '@/components'
import { useAuth } from '@/hooks'

function CreateJamPage() {
  const { user } = useAuth()
  
  return (
    <HostOnly
      fallback={
        <div className="alert alert-warning">
          <p>Only jam hosts can create jams.</p>
          <a href="/login" className="btn btn-sm">Login as Host</a>
        </div>
      }
    >
      <div>
        <h1>Create New Jam</h1>
        <CreateJamForm hostId={user!.id} />
      </div>
    </HostOnly>
  )
}
```

### Pattern 3: Conditional UI

```typescript
import { useAuth } from '@/hooks'
import { useCanAccess } from '@/lib/auth/routeGuardHooks'

function JamCard({ jam }) {
  const { user } = useAuth()
  const canEdit = user?.id === jam.hostId
  const canRegister = useCanAccess(['user', 'host'])
  
  return (
    <div className="card">
      <h2>{jam.name}</h2>
      
      {canEdit && (
        <>
          <button>Edit</button>
          <button>Delete</button>
        </>
      )}
      
      {canRegister && (
        <button>Register</button>
      )}
    </div>
  )
}
```

### Pattern 4: User Profile Update

```typescript
import { useAuth } from '@/hooks'

function EditProfile() {
  const { user, updateUser } = useAuth()
  
  const handleUpdate = (newData: Partial<AuthUser>) => {
    // Update context (also updates localStorage)
    updateUser(newData)
    
    // Call backend to persist
    await userService.updateProfile(newData)
  }
}
```

### Pattern 5: Navigation Awareness

```typescript
import { useAuth } from '@/hooks'

function Navbar() {
  const { user, role, logout, isHost } = useAuth()
  
  return (
    <nav>
      <div>
        <span className="badge">{getRoleLabel(role)}</span>
      </div>
      
      {isHost() && (
        <a href="/host/dashboard">Dashboard</a>
      )}
      
      {user && (
        <button onClick={logout}>Logout</button>
      )}
    </nav>
  )
}
```

---

## Best Practices

### 1. Always Check isLoading
Wait for auth initialization before making decisions.

```typescript
const { isLoading, user } = useAuth()

if (isLoading) {
  return <Spinner />
}

// Safe to check user now
```

### 2. Use Fallback Props
Provide custom UI for unauthorized access.

```typescript
<HostOnly
  fallback={<CustomNotAuthorized message="Hosts only" />}
>
  <Content />
</HostOnly>
```

### 3. Check Permissions Before Rendering
Avoid visual flickering.

```typescript
const { user } = useAuth()
const isOwner = user?.id === resource.ownerId

// Don't render button if no permission
{isOwner && <button>Edit</button>}
```

### 4. Handle localStorage Errors
Gracefully degrade if localStorage is unavailable.

```typescript
try {
  localStorage.setItem('auth_user', JSON.stringify(user))
} catch (err) {
  console.error('Failed to save to localStorage', err)
  // User data won't persist across reloads
  // App still functions normally
}
```

### 5. Validate on Backend
Never trust frontend role checks alone.

```typescript
// Frontend checks permission
const canCreate = useCanAccess('host')

if (canCreate) {
  // But backend MUST also verify
  const response = await jamService.create(data)
  // Backend returns 403 if not actually a host
}
```

---

## Testing

### Test Page Locations

- **Auth Context**: `http://localhost:5173/?authContext=true`
- **Route Guards**: `http://localhost:5173/?routeGuards=true`
- **localStorage**: `http://localhost:5173/?localStorage=true`

### Manual Testing Checklist

#### Authentication Flow
- [ ] Login as each role (Viewer, User, Host)
- [ ] Verify correct user info displays
- [ ] Verify role badge shows correct role
- [ ] Verify navigation items appear/disappear

#### Route Guards
- [ ] View protected content as authorized role
- [ ] Attempt access as unauthorized role
- [ ] Verify fallback displays
- [ ] Test with multiple role requirements

#### Persistence
- [ ] Log in
- [ ] Refresh page (F5)
- [ ] Verify still logged in
- [ ] Verify localStorage data intact
- [ ] Logout
- [ ] Refresh page
- [ ] Verify logged out

#### Role Transitions
- [ ] Log in as User
- [ ] Switch to Host role
- [ ] Verify context and UI update
- [ ] Verify new permissions available
- [ ] Navigate to host-only pages
- [ ] Should work correctly

---

## File Structure

```
src/
├── contexts/
│   └── AuthContext.tsx          # Context provider
│
├── hooks/
│   ├── useAuth.ts              # Main auth hook
│   └── index.ts                # Export useAuth
│
├── lib/auth/
│   ├── authStorage.ts          # localStorage utilities
│   ├── roleUtils.ts            # Permission helpers
│   ├── routeGuardHooks.ts       # Guard hooks
│   └── index.ts                # Export all
│
├── components/
│   ├── RouteGuards.tsx          # Guard components
│   ├── Navbar.tsx              # Role-aware nav
│   ├── ErrorAlert.tsx          # Error component
│   └── test/
│       ├── AuthContextTestComponent.tsx
│       ├── LocalStoragePersistenceTestComponent.tsx
│
├── pages/
│   ├── AuthContextTestPage.tsx
│   ���── RouteGuardsExamplePage.tsx
│   └── LocalStoragePersistenceTestPage.tsx
│
├── types/
│   └── auth.types.ts           # Type definitions
│
└── App.tsx                      # Wrapped with AuthProvider
```

---

## Troubleshooting

### Issue: User data not persisting

**Symptoms:** User loses login on page refresh

**Solutions:**
1. Check if localStorage is enabled in browser
2. Check if auth_token and auth_user keys exist in DevTools
3. Check browser console for errors
4. Verify AuthProvider wraps entire app

**Debug:**
```typescript
// In console
localStorage.getItem('auth_token')    // Should exist
localStorage.getItem('auth_user')     // Should exist
```

---

### Issue: Route guard not working

**Symptoms:** Unauthorized users can access protected content

**Solutions:**
1. Verify ProtectedRoute has requiredRole prop
2. Check that fallback is provided or ErrorAlert displays
3. Verify useAuth() returns correct role

**Debug:**
```typescript
// Add to ProtectedRoute temporarily
console.log('Role:', role, 'Required:', requiredRole, 'Authorized:', isAuthorized)
```

---

### Issue: Navbar not updating on login

**Symptoms:** Navbar doesn't reflect new user info after login

**Solutions:**
1. Verify Navbar is using useAuth() hook
2. Check that login() was called with user data
3. Verify component re-renders after state change

---

### Issue: localStorage exceeds quota

**Symptoms:** Can't save to localStorage, quota exceeded

**Solutions:**
1. Clear old/unused localStorage entries
2. Reduce size of stored data
3. Implement data cleanup on logout
4. Use session storage for temporary data

---

## API Integration

### Expected Backend Responses

**Login Response:**
```json
{
  "userId": "123",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "host",
  "token": "eyJhbGc..."
}
```

**User Profile Response:**
```json
{
  "id": "123",
  "name": "Jane Smith",
  "email": "jane@example.com",
  "role": "user",
  "instrument": "Guitar",
  "level": "INTERMEDIATE"
}
```

---

## Summary

✅ **Complete role-based authentication system**
- 3 user roles with distinct permissions
- Context-based state management
- Route guards for access control
- localStorage persistence
- Role-aware navigation
- Permission checking utilities
- Comprehensive testing tools
- Full TypeScript support

**Status**: Ready for production use

---

**For Questions or Issues:**
1. Check Troubleshooting section
2. Review Usage Patterns for your use case
3. Run test pages to verify functionality
4. Check browser console for errors

