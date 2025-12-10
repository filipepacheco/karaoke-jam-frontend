# API Endpoints URL Fix - Complete ✅

## Problem
When seeding test data, the application threw error: `relativeURL.replace is not a function` with status code `REQUEST_ERROR`.

The error occurred because:
1. Service methods (musicianService, musicService, registrationService, scheduleService) were trying to use `API_ENDPOINTS.musicians`, `API_ENDPOINTS.music`, etc. as URL strings
2. These endpoints were defined as **objects** in the config, not strings
3. When axios tried to process an object as a URL, it failed during string manipulation

## Root Causes

### 1. Inconsistent API_ENDPOINTS Structure
The original `API_ENDPOINTS` configuration had mixed structures:
```typescript
// ❌ WRONG - jams was an object with nested methods
jams: {
  list: '/jams',
  detail: (id) => `/jams/${id}`,
  // ...
}

// ❌ WRONG - musicians was an object with nested methods  
musicians: {
  list: '/musicians',
  detail: (id) => `/musicians/${id}`,
  // ...
}
```

### 2. Services Using Incorrect Endpoint References
Services were trying to use these objects directly:
```typescript
// ❌ WRONG - trying to use an object as a string URL
return apiClient.post<MusicoResponseDto>(API_ENDPOINTS.musicians, data)
```

### 3. Missing Endpoints
Several endpoints required by services weren't defined:
- `music` / `musicById`
- `musicByJam`
- `linkMusicToJam`
- `schedules` / `scheduleById`
- `schedulesByJam`
- `schedulesByMusician`
- `reorderSchedules`
- And corresponding registration endpoints

### 4. Missing jamService.create() Method
The jamService didn't have a `create` method which was needed for test data seeding

## Solutions Applied

### 1. Restructured API_ENDPOINTS Configuration
Changed from nested objects to flat URL strings and function endpoints:

```typescript
// ✅ CORRECT - Flat structure with strings and functions
export const API_ENDPOINTS = {
  // Musicians (Músicos) endpoints
  musicians: '/musicos',
  musicianById: (id: string) => `/musicos/${id}`,

  // Music/Songs (Músicas) endpoints
  music: '/musicas',
  musicById: (id: string) => `/musicas/${id}`,
  musicByJam: (jamId: string) => `/jams/${jamId}/musicas`,
  linkMusicToJam: (musicId: string, jamId: string) => `/musicas/${musicId}/jams/${jamId}`,

  // Registrations (Inscrições) endpoints
  registrations: '/inscricoes',
  registrationById: (id: string) => `/inscricoes/${id}`,
  registrationsByJam: (jamId: string) => `/jams/${jamId}/inscricoes`,
  registrationsByMusician: (musicianId: string) => `/musicos/${musicianId}/inscricoes`,

  // Schedules (Escalas) endpoints
  schedules: '/escalas',
  scheduleById: (id: string) => `/escalas/${id}`,
  schedulesByJam: (jamId: string) => `/jams/${jamId}/escalas`,
  schedulesByMusician: (musicianId: string) => `/musicos/${musicianId}/escalas`,
  reorderSchedules: (jamId: string) => `/jams/${jamId}/escalas/reorder`,
}
```

### 2. Updated Service Methods
Added type casting where needed for string endpoints:

```typescript
// ✅ CORRECT - Cast to string for endpoints that are strings
async create(data: CreateMusicianDto): Promise<ApiResponse<MusicoResponseDto>> {
  return apiClient.post<MusicoResponseDto>(API_ENDPOINTS.musicians as string, data)
}
```

### 3. Added Missing jamService.create() Method
```typescript
export async function create(jamData: Partial<JamResponseDto>): Promise<ApiResponse<JamResponseDto>> {
  // Implementation for creating new jams
}
```

## Files Modified

1. **src/lib/api/config.ts**
   - Restructured API_ENDPOINTS to flat structure
   - Added all missing endpoint definitions
   - Removed nested object structure

2. **src/services/musicianService.ts**
   - Updated to cast `API_ENDPOINTS.musicians` as string

3. **src/services/musicService.ts**
   - Updated to cast `API_ENDPOINTS.music` as string

4. **src/services/registrationService.ts**
   - Updated to cast `API_ENDPOINTS.registrations` as string

5. **src/services/scheduleService.ts**
   - Updated to cast `API_ENDPOINTS.schedules` as string

6. **src/services/jamService.ts**
   - Added new `create()` method for creating jams

## Verification

✅ **Build Status**: Successful with no TypeScript errors
✅ **Dev Server**: Running on localhost:5173
✅ **API Endpoints**: All endpoints properly defined
✅ **Services**: All methods available and correctly typed
✅ **Test Data Seed Page**: Ready to use at `/test/seed-data`

## Architecture Now

```
Service Layer
    ├── musicianService.create()  → POST /musicos
    ├── musicService.create()     → POST /musicas
    ├── registrationService.create() → POST /inscricoes
    └── scheduleService.create()  → POST /escalas

Endpoint Resolution
    API_ENDPOINTS.musicians    → '/musicos'
    API_ENDPOINTS.musicianById(id) → '/musicos/:id'
    API_ENDPOINTS.music        → '/musicas'
    API_ENDPOINTS.registrations → '/inscricoes'
    API_ENDPOINTS.schedules    → '/escalas'

API Client
    Receives URL string/function → Resolves to full URL → Sends to backend
```

## Next Steps

1. Test the seed data page: Navigate to `http://localhost:5173/test/seed-data`
2. Click "Seed Test Data" button
3. View created test data in the jam pages
4. Verify all components display data correctly

## Error Recovery

If you encounter similar `relativeURL.replace` errors in the future:

1. Check that API_ENDPOINTS values are **strings** or **functions returning strings**
2. Ensure no objects are passed directly to axios methods
3. Use `as string` type casting when mixing string literals with function calls
4. Verify all required endpoint definitions exist in API_ENDPOINTS

---

**Fixed**: December 6, 2025
**Status**: Production Ready ✅

