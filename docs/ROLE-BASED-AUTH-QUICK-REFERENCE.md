# Role-Based Authentication - Quick Reference

## Quick Start

### 1. Use Auth in Components
```typescript
import { useAuth } from '@/hooks'

function MyComponent() {
  const { user, role, logout, isHost } = useAuth()
  // Use auth state and methods
}
```

### 2. Protect Routes
```typescript
import { HostOnly, UserOnly, ProtectedRoute } from '@/components'

// Simple guards
<HostOnly><CreateJam /></HostOnly>
<UserOnly><MyProfile /></UserOnly>

// Generic guard
<ProtectedRoute requiredRole={['user', 'host']}>
  <Content />
</ProtectedRoute>
```

### 3. Check Permissions
```typescript
import { useCanAccess } from '@/lib/auth/routeGuardHooks'

const canCreate = useCanAccess('host')
const canRegister = useCanAccess(['user', 'host'])
```

## Common Tasks

### Login User
```typescript
const { login } = useAuth()

login(userData, token)
// userData: AuthUser object
// token: JWT token from backend
```

### Logout User
```typescript
const { logout } = useAuth()

logout()
// Clears localStorage and resets to viewer
```

### Update User Profile
```typescript
const { updateUser } = useAuth()

updateUser({ name: 'New Name' })
// Updates both context and localStorage
```

### Conditional Rendering
```typescript
const { user, isHost } = useAuth()

{user && <span>{user.name}</span>}
{isHost() && <button>Host Menu</button>}
```

## Roles at a Glance

| Role | Permissions | Default Path |
|------|-------------|--------------|
| **Viewer** | View only | / |
| **User** | Register, manage self | /my-registrations |
| **Host** | Create, manage jams | /host/dashboard |

## Test Pages

| Page | URL |
|------|-----|
| Auth Context | `?authContext=true` |
| Route Guards | `?routeGuards=true` |
| localStorage | `?localStorage=true` |

## Key Files

| File | Purpose |
|------|---------|
| `AuthContext.tsx` | Provider & state |
| `useAuth.ts` | Main hook |
| `RouteGuards.tsx` | Guard components |
| `routeGuardHooks.ts` | Permission hooks |
| `roleUtils.ts` | Helper functions |

## Common Patterns

### Protected Page
```typescript
function CreateJam() {
  return (
    <HostOnly fallback={<NotHost />}>
      <Form />
    </HostOnly>
  )
}
```

### Permission Check
```typescript
function JamCard({ jam }) {
  const { user } = useAuth()
  const isOwner = user?.id === jam.hostId
  
  return (
    <>
      {isOwner && <button>Edit</button>}
    </>
  )
}
```

### Role-Aware Navigation
```typescript
function Navbar() {
  const { isHost, user, logout } = useAuth()
  
  return (
    <>
      {isHost() && <a href="/host/dashboard">Dashboard</a>}
      {user && <button onClick={logout}>Logout</button>}
    </>
  )
}
```

## Debugging

### Check Current Auth State
```typescript
const auth = useAuth()
console.log(auth)
// Shows: user, role, isAuthenticated, isLoading
```

### Verify localStorage
```javascript
// In browser console
localStorage.getItem('auth_token')
localStorage.getItem('auth_user')
```

### Test Route Guard
```typescript
// Add to ProtectedRoute temporarily
console.log({ role, requiredRole, isAuthorized })
```

## Permissions Matrix

| Action | Viewer | User | Host |
|--------|--------|------|------|
| View Jams | ✅ | ✅ | ✅ |
| Register | ❌ | ✅ | ✅ |
| Create Jam | ❌ | ❌ | ✅ |
| Edit Own Jam | ❌ | ❌ | ✅ |
| Manage Registrations | ❌ | ❌ | ✅ |

## Hooks Reference

### useAuth()
```typescript
const {
  user,               // AuthUser | null
  isAuthenticated,    // boolean
  isLoading,         // boolean
  role,              // 'viewer' | 'user' | 'host'
  login,             // (user, token) => void
  logout,            // () => void
  setRole,           // (role) => void
  updateUser,        // (fields) => void
  isHost,            // () => boolean
  isUser,            // () => boolean
  isViewer,          // () => boolean
} = useAuth()
```

### useCanAccess(role?)
```typescript
const hasAccess = useCanAccess('host')
const multiRole = useCanAccess(['user', 'host'])
```

## Guard Components Reference

### ProtectedRoute
```typescript
<ProtectedRoute 
  requiredRole="host" 
  fallback={<Denied />}
>
  <Content />
</ProtectedRoute>
```

### HostOnly
```typescript
<HostOnly fallback={<Denied />}>
  <Content />
</HostOnly>
```

### UserOnly
```typescript
<UserOnly fallback={<LoginPrompt />}>
  <Content />
</UserOnly>
```

### AuthenticatedOnly
```typescript
<AuthenticatedOnly fallback={<LoginPrompt />}>
  <Content />
</AuthenticatedOnly>
```

### ViewerOnly
```typescript
<ViewerOnly fallback={<AlreadyLoggedIn />}>
  <Content />
</ViewerOnly>
```

---

**For detailed documentation:** See `ROLE-BASED-AUTH-DOCUMENTATION.md`

