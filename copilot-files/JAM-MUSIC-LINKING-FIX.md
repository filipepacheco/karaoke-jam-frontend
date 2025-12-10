# JAM MUSIC LINKING FIX

## Problem
When seeding test data, got error:
```
statusCode: 409, error: 'Conflict'
message: 'Link between jam and music not found'
```

## Root Cause
The `linkToJam` method in musicService wasn't sending the required jamId in the request body when calling the PATCH endpoint.

## Solution Applied

### Before (❌ Incorrect)
```typescript
async linkToJam(musicId: string, jamId: string): Promise<ApiResponse<void>> {
  return apiClient.patch<void>(API_ENDPOINTS.linkMusicToJam(musicId, jamId))
  // ❌ No data sent in body
}
```

### After (✅ Correct)
```typescript
async linkToJam(musicId: string, jamId: string): Promise<ApiResponse<Record<string, unknown>>> {
  return apiClient.patch<Record<string, unknown>>(
    API_ENDPOINTS.linkMusicToJam(musicId, jamId), 
    { jamId }  // ✅ Send jamId in request body
  )
}
```

## Changes Made

### File: src/services/musicService.ts
- Updated `linkToJam` method to send `{ jamId }` as request body
- Changed return type from `ApiResponse<void>` to `ApiResponse<Record<string, unknown>>`

### File: src/pages/TestDataSeedPage.tsx  
- Added music-to-jam linking step before creating registrations
- Calls `musicService.linkToJam()` for each created song
- Uses song IDs as jamMusicIds for registration creation

## Data Flow
```
1. Create musicians ✓
2. Create songs ✓
3. Link songs to jam ← NEW STEP
   └─ Sends: PATCH /musicas/{musicId}/jams/{jamId} with { jamId }
4. Create registrations
   └─ Uses linked music IDs for jamMusicId field
5. Create schedules ✓
```

## Testing
Run test data seed page and confirm:
- ✓ Created 4 musicians
- ✓ Created 3 songs  
- ✓ Linked 3 songs to jam (NEW)
- ✓ Created 4 registrations
- ✓ Created 4 schedules

## Status
✅ Fixed - Ready to test

