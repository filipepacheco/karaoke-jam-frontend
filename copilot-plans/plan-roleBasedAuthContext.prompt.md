## Plan: Role-Based Authentication Context

This plan outlines the implementation of a role-based authentication context system to support three distinct user roles (Viewer, User/Musician, Host) with proper state management, permissions, and localStorage persistence.

### 1. Core Architecture

**File Structure:**
- `src/types/auth.types.ts` - Type definitions
  - `UserRole` type: 'viewer' | 'user' | 'host'
  - `AuthUser` interface with id, name, email, role, and role-specific fields
  - `AuthContextType` with methods and state

- `src/contexts/AuthContext.tsx` - React Context
  - Create AuthContext using createContext()
  - Provide user state, authentication state, loading state
  - Provide methods: login(), logout(), setRole()
  - Provide helper methods: isHost(), isUser(), isViewer()

- `src/hooks/useAuth.ts` - Custom hook
  - useAuth() hook to consume AuthContext
  - Error handling if context not found

- `src/lib/auth/roleUtils.ts` - Role utilities
  - canAccess(role, requiredRole) - Permission checking
  - hasPermission(user, action) - Action-based permissions
  - redirectByRole(role) - Get default redirect path

### 2. Authentication Flow

**State Management:**
- Store current user in context
- Store authentication status (isAuthenticated boolean)
- Store loading state (during auth checks)
- Store current role with fallback to 'viewer'
- Persist token in localStorage (already have setToken/getToken)

**User Flow:**
1. App loads → Check localStorage for token
2. If token exists → Restore user session from localStorage
3. If no token → Default to 'viewer' role
4. User can transition between roles:
   - viewer → user (register as musician)
   - viewer → host (create jams)
   - user → host (switch to hosting mode)

### 3. Data Model

**AuthUser Interface:**
```
{
  id: string
  name: string
  email: string
  role: 'viewer' | 'user' | 'host'
  
  // Musician-specific fields (if role = 'user')
  instrument?: string
  level?: string
  contact?: string
  
  // Host-specific fields (if role = 'host')
  hostName?: string
  hostContact?: string
}
```

### 4. Context Methods

**Required Methods:**
- `login(user)` - Set authenticated user
- `logout()` - Clear user and token
- `setRole(role)` - Switch user role
- `isHost()` - Check if user is host
- `isUser()` - Check if user is musician
- `isViewer()` - Check if anonymous/viewer
- `updateUser(fields)` - Update user profile

### 5. Integration Points

**In App.tsx:**
- Wrap app with AuthProvider
- Check role before rendering pages
- Show different navigation based on role

**In Navigation:**
- Show different menu items per role
- Hide admin/host options from viewers
- Hide user profile from anonymous

**In Pages:**
- Use useAuth() hook to check permissions
- Redirect unauthorized users
- Show role-specific content

**In API Calls:**
- Auto-inject auth token from context
- Refresh token on 401 responses
- Handle logout on 403 responses

### 6. Role-Based Access Control

**Viewer (Anonymous):**
- View jams, musicians, music
- View public dashboard
- No create/edit/delete permissions

**User (Musician):**
- All viewer permissions
- Create profile
- Register for jams
- View own registrations
- View own performances
- Edit own profile

**Host (Organizer):**
- All user permissions
- Create jams
- Edit own jams
- Delete own jams
- Manage registrations
- Set schedules
- View analytics

### 7. localStorage Persistence

**Store:**
- User data (name, email, role, id)
- Current role
- Auth token (already implemented)

**Load on app start:**
- Check token validity
- Load user data if valid
- Fall back to 'viewer' if invalid

### 8. Error Handling

**Cases:**
- Token expired → logout and redirect to home
- Invalid role → default to 'viewer'
- Missing required fields → show error
- Permission denied → show error alert
- Session lost → show re-login prompt

### 9. Testing Strategy

**Test scenarios:**
- Switch between roles
- Verify permissions per role
- Check localStorage persistence
- Test logout flow
- Test invalid token handling
- Test role transitions

**Test pages:** Use existing test infrastructure (add ?auth=context for testing)

### 10. Implementation Order

1. Define `auth.types.ts` with all type definitions
2. Create `AuthContext.tsx` with provider and hooks
3. Create `useAuth.ts` custom hook
4. Create `roleUtils.ts` with permission helpers
5. Add AuthProvider to App.tsx
6. Create test component to verify context works
7. Add role-based navigation logic
8. Add route guards for role-based pages
9. Add localStorage persistence
10. Document usage and patterns

### 11. Next Steps After Implementation

- Build role-aware Navigation component
- Build role-based route protection
- Build Login/Registration pages
- Build pages for each role:
  - Viewer: Browse Jams, Jam Details, Dashboard
  - User: Profile, My Registrations, My Performances
  - Host: Host Dashboard, Create Jam, Manage Registrations

### Key Features

✅ Three distinct user roles with different permissions
✅ Context-based state management for authentication
✅ localStorage persistence for session recovery
✅ Seamless role transitions
✅ Helper methods for permission checking
✅ Integration with existing auth storage utilities
✅ Type-safe with full TypeScript support
✅ Testable with dedicated test infrastructure

### Implementation Considerations

- **MVP Scope**: Simple role-based access, no automatic token refresh
- **localStorage**: Used for simplicity (consider JWT validation on load)
- **Manual Logout**: User controls logout (no auto-logout on inactivity)
- **No Network Check**: Assumes backend validates permissions

