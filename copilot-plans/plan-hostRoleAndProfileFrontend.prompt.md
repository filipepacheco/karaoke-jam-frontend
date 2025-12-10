# Frontend Integration: Host Role & Profile Management

## Overview

The backend now supports dual roles (musician & host), optional user names collected after login, and a new `/auth/profile` PATCH endpoint for deferred profile updates. Frontend needs to integrate these changes to support the new user flow: login with deferred name collection → profile setup → host designation → jam creation with `hostMusicianId`.

## Current State Analysis

### What Backend Changed
1. **AuthResponseDto** now includes `isHost: boolean` and optional `name: string?`
2. **UpdateProfileDto** added for PATCH `/auth/profile` endpoint (name, instrument, level, contact)
3. **CreateJamDto** now accepts `hostMusicianId?: string` instead of relying on denormalized fields
4. **Auth endpoints** updated:
   - POST `/auth/login` → returns `isHost` boolean
   - POST `/auth/sync-user` → returns `isHost` boolean
   - PATCH `/auth/profile` → new endpoint to update profile after login

### What Frontend Currently Has
1. **AuthUser type** has `name: string` (required), no `isHost` field
2. **BackendSyncResponse** doesn't handle `isHost`
3. **OnboardingModal** only collects instrument & genre, not name
4. **CreateJamPage** uses denormalized `hostName` and `hostContact` fields
5. **Profile updates** currently don't have dedicated service/endpoint
6. **isHost()** is a method that checks `role === 'host'` (wrong - should be a boolean field)

## Implementation Plan

### Phase 1: Type Updates

#### 1.1 Update auth.types.ts
- Change `AuthUser.name` from `string` to `string | null`
- Add `isHost: boolean` field to `AuthUser`
- Keep `role: UserRole` for backward compatibility (can be derived from `isHost` or kept separate)
- Add `updateProfile(updates: ProfileUpdates)` method to `AuthContextType`

**Current problematic code:**
```
export interface AuthUser {
  id: string
  name: string  // ← make optional
  // missing isHost: boolean
}

export interface AuthContextType {
  isHost: () => boolean  // ← remove this method
  // missing updateProfile method
}
```

#### 1.2 Update api.types.ts
- Add `BackendAuthResponseDto` with `isHost: boolean`, optional `name`
- Ensure `UpdateProfileDto` type matches backend: `name?`, `instrument?`, `level?`, `contact?`

**New types needed:**
```
export interface BackendAuthResponseDto {
  userId: string
  name?: string
  email?: string
  phone?: string
  isHost: boolean
  token: string
  isNewUser: boolean
  instrument?: string
  level?: MusicianLevel
}

export interface UpdateProfileDto {
  name?: string
  instrument?: string
  level?: MusicianLevel
  contact?: string
}
```

---

### Phase 2: Service Layer Updates

#### 2.1 Update backendAuthService.ts

**syncSupabaseUserToBackend():**
- Extract `isHost` from response
- Handle `name` as optional (no fallback generation)
- Return `isHost` in `SyncResult`

**Add new updateProfile() function:**
```typescript
export async function updateProfile(
  token: string,
  updates: UpdateProfileDto
): Promise<{ success: boolean; data?: AuthUser; error?: string }>
```
- Calls `PATCH /auth/profile` endpoint
- Returns updated user data
- Updates stored auth_user in localStorage

**Add new getAuthMe() function:**
```typescript
export async function getAuthMe(token: string): Promise<{ user?: AuthUser; error?: string }>
```
- Calls `GET /auth/me` endpoint
- Used for fetching current profile

---

### Phase 3: Auth Context Updates

#### 3.1 Update AuthContext.tsx

**State changes:**
- Add `isHost` as separate boolean state (not derived from role)
- Keep `role` state but derive it from `isHost` if needed

**Method changes:**
- Remove `isHost()` method (it's now a boolean property on `user`)
- Add `updateProfile(updates: UpdateProfileDto)` method
- Update `handleAuthSuccess()` to extract and store `isHost`
- Update localStorage to persist `isHost` with user

**Updated AuthContextType.value:**
```typescript
const value: AuthContextType = {
  user,           // user.isHost is now available
  isAuthenticated,
  isLoading,
  role,           // keep for backward compat
  isNewUser,
  // ... methods
  updateProfile,  // new method
  // remove: isHost (it's now user.isHost)
}
```

**Impact on existing code:**
- Pages using `isHost()` will break → need migration
  - Change `isHost()` → `user?.isHost || false`
  - Or keep a compatibility wrapper in useAuth

---

### Phase 4: Profile Setup Component

#### 4.1 Create ProfileSetupModal.tsx

**Replaces/extends OnboardingModal for:**
- Collecting name (was missing)
- Collecting instrument
- Collecting level (new from backend)
- Collecting contact (optional)

**Trigger condition:**
- Show when `isNewUser && user?.name === null`
- Modal shouldn't close until at least name is provided (or explicitly skipped)

**Form structure:**
```
- Name field (required or required-with-skip)
- Instrument dropdown (required)
- Level dropdown (BEGINNER | INTERMEDIATE | ADVANCED | PROFESSIONAL)
- Contact field (optional, email/phone)
- Save button
- Skip button (optional, for later completion)
```

**Submission:**
- Call `updateProfile({ name, instrument, level, contact })`
- Update auth context user data
- Close modal on success
- Show error if profile update fails

---

### Phase 5: CreateJamPage Updates

#### 5.1 Update jam creation form

**Current problematic code:**
```typescript
const [formData, setFormData] = useState<FormData>({
  // ...
  hostName: user?.name || '',
  hostContact: user?.email || user?.phone || '',
  // ...
})
```

**New approach:**
- Add `hostMusicianId: string` to FormData
- Pre-fill with current `user?.id` if user is authenticated
- Pass `hostMusicianId` in create jam request
- Still support denormalized fields for backward compatibility (populate from current user data)

**Form changes:**
- Remove manual `hostName`/`hostContact` input fields if auto-populating from user
- Or keep them as read-only display of current user info
- Add validation that `hostMusicianId` is set before submission

**Create jam request:**
```typescript
await jamService.create({
  // ... other fields
  hostMusicianId: user?.id,
  // optionally still send for backward compat:
  hostName: user?.name || null,
  hostContact: user?.email || user?.phone || null,
})
```

---

### Phase 6: Migration of Existing Usage

#### 6.1 Update all `isHost()` calls

**Files to update:**
- `src/contexts/AuthContext.tsx` - remove the method
- `src/pages/MusicPage.tsx` - change `isHost()` to `user?.isHost`
- `src/components/MusicEmptyState.tsx` - change prop type
- `src/components/MusicTable.tsx` - change usage
- `src/components/Navbar.tsx` - change usage
- Any other component using `isHost()`

**Find and replace strategy:**
```
// Old: const { isHost } = useAuth(); ... isHost()
// New: const { user } = useAuth(); ... user?.isHost
```

#### 6.2 Update OnboardingModal or create ProfileSetupModal

**Options:**
- **Option A:** Rename OnboardingModal to ProfileSetupModal and extend it
- **Option B:** Keep both, use ProfileSetupModal as the new flow
- **Recommendation:** Rename to ProfileSetupModal (clearer name) and add name field

---

### Phase 7: Integration Points

#### 7.1 LoginPage.tsx

**After successful login:**
- User is redirected to home or jam detail page
- If `isNewUser && user?.name === null`, show ProfileSetupModal
- Modal shouldn't be dismissible without completing profile (or explicit skip)

**Logic:**
```typescript
export function LoginPage() {
  const { isAuthenticated, isLoading, user, isNewUser } = useAuth()
  const [showProfileSetup, setShowProfileSetup] = useState(false)

  useEffect(() => {
    if (isAuthenticated && isNewUser && user?.name === null) {
      setShowProfileSetup(true)
    }
  }, [isAuthenticated, isNewUser, user?.name])

  // ... rest of component
}
```

#### 7.2 App.tsx or Router

**Could also trigger ProfileSetupModal at app level:**
- Create a ProtectedProfileRoute that checks for incomplete profiles
- Or use a layout-level effect to show modal
- Ensures profile setup happens regardless of which page user visits

---

### Phase 8: Backward Compatibility Considerations

#### 8.1 Old denormalized jam data

**Issue:**
- Existing jams might only have `hostName` and `hostContact` (no `hostMusicianId`)
- Need to display these correctly

**Solution:**
- In jam list/detail pages, check for `hostMusicianId` first
- Fall back to `hostName` if no `hostMusicianId`
- No migration needed on frontend (backend handles denormalization on create)

#### 8.2 Name field changes

**Issue:**
- User's `name` can now be `null` after first login
- UI should handle null names gracefully

**Solution:**
- Use `user?.name || 'Anonymous'` or `user?.name || user?.email?.split('@')[0]`
- Or show "Complete your profile" nudge if name is null

---

## Testing Checklist

### Unit Tests Needed
- [ ] `updateProfile()` service function
- [ ] `AuthContext` handling `isHost` boolean
- [ ] `ProfileSetupModal` form submission
- [ ] Backward compatibility with old denormalized jam data

### Integration Tests Needed
- [ ] Full login → profile setup → jam creation flow
- [ ] OAuth login triggers profile setup for new users
- [ ] Email/password signup triggers profile setup
- [ ] Existing users without null name skip profile setup
- [ ] Profile updates persist to localStorage and sync to backend

### Manual Testing Needed
- [ ] New user login with email → sees profile setup modal
- [ ] New user completes profile → modal closes, user logged in
- [ ] User skips profile setup → can complete later
- [ ] Host creates jam with auto-populated user ID
- [ ] Old jams still display with `hostName`/`hostContact`
- [ ] isHost flag correctly propagates to components

---

## Implementation Order

1. **Step 1:** Update auth types (auth.types.ts, api.types.ts)
2. **Step 2:** Update backendAuthService with new sync logic and profile functions
3. **Step 3:** Update AuthContext to handle `isHost` boolean and `updateProfile` method
4. **Step 4:** Create ProfileSetupModal component
5. **Step 5:** Integrate ProfileSetupModal into LoginPage or App-level
6. **Step 6:** Migrate all `isHost()` calls to `user?.isHost`
7. **Step 7:** Update CreateJamPage to use `hostMusicianId`
8. **Step 8:** Test full flow and backward compatibility

---

## Open Questions / Considerations

1. **Profile Requirements:** Should profile setup be blocking (modal can't be dismissed) or can user skip? Current backend doesn't enforce name, so probably allow skip.

2. **Role Transitions:** Backend sets `isHost` via database only (MVP). Should we add UI to show "Host" status, or hide it since it's admin-only?

3. **Level vs Genre:** Backend changed from genre to level. Should we keep genre selection, or replace with level in ProfileSetupModal?

4. **Contact Field:** What's the purpose of contact on profile vs email/phone on Supabase? Should we clarify or validate?

5. **Old Onboarding:** OnboardingModal currently exists and collects instrument/genre. Do we:
   - Delete it and replace with ProfileSetupModal?
   - Keep both (one for profile, one for preferences)?
   - Merge into single ProfileSetupModal?

---

## Files Involved

### Types & Config
- [ ] `src/types/auth.types.ts` - Add `isHost`, make `name` optional, remove `isHost()` method
- [ ] `src/types/api.types.ts` - Add response/update DTOs

### Services
- [ ] `src/services/backendAuthService.ts` - Add `updateProfile()`, `getAuthMe()`, update sync logic

### Context & Hooks
- [ ] `src/contexts/AuthContext.tsx` - Add `isHost` state, `updateProfile()` method, remove `isHost()` method
- [ ] `src/hooks/useAuth.ts` - No changes (just uses updated context)

### Components
- [ ] `src/components/ProfileSetupModal.tsx` - NEW
- [ ] `src/components/OnboardingModal.tsx` - Possibly delete or keep as reference
- [ ] `src/pages/LoginPage.tsx` - Integrate ProfileSetupModal trigger
- [ ] `src/pages/CreateJamPage.tsx` - Use `hostMusicianId` instead of denormalized fields
- [ ] `src/pages/MusicPage.tsx` - Update `isHost()` calls
- [ ] `src/components/MusicEmptyState.tsx` - Update `isHost` prop type
- [ ] `src/components/MusicTable.tsx` - Update `isHost` usage
- [ ] `src/components/Navbar.tsx` - Update `isHost` usage

### Possible Minor Updates
- [ ] `src/App.tsx` - Could add app-level profile setup check
- [ ] Any other pages/components using `isHost()`

