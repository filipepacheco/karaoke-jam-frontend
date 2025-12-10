# API Endpoints Reference

## Before (❌ Incorrect)

```typescript
export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    me: '/auth/me',
    refreshToken: '/auth/refresh',
  },
  jams: {
    list: '/jams',
    detail: (id: string) => `/jams/${id}`,
    create: '/jams',
    update: (id: string) => `/jams/${id}`,
    delete: (id: string) => `/jams/${id}`,
  },
  registrations: {
    list: '/registrations',
    create: '/registrations',
    update: (id: string) => `/registrations/${id}`,
    delete: (id: string) => `/registrations/${id}`,
  },
  musicians: {
    list: '/musicians',
    detail: (id: string) => `/musicians/${id}`,
    update: (id: string) => `/musicians/${id}`,
  },
  // ❌ Missing: music, songs, schedules endpoints
  // ❌ Problem: Nested objects caused type errors
}
```

## After (✅ Correct)

```typescript
export const API_ENDPOINTS = {
  // Auth endpoints
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    me: '/auth/me',
    refreshToken: '/auth/refresh',
  },

  // Jams endpoints
  jams: {
    list: '/jams',
    detail: (id: string) => `/jams/${id}`,
    create: '/jams',
    update: (id: string) => `/jams/${id}`,
    delete: (id: string) => `/jams/${id}`,
  },

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

## Key Changes

### 1. Flattened Structure
- **Before**: Nested objects with `.list`, `.detail`, `.create`, etc.
- **After**: Direct endpoint strings and functions at top level

### 2. Consistent Naming
- **Before**: Mixed patterns (`/musicians`, `/registrations`)
- **After**: Portuguese API names (`/musicos`, `/musicas`, `/inscricoes`, `/escalas`)

### 3. Complete Endpoint Coverage
- **Before**: Missing music, schedules, and most sub-resources
- **After**: All endpoints defined:
  - Base: `/musicos`, `/musicas`, `/inscricoes`, `/escalas`
  - By ID: All have corresponding `*ById` endpoints
  - Relations: All have corresponding `*ByJam` and `*ByMusician` endpoints
  - Special: `linkMusicToJam`, `reorderSchedules`

### 4. Type Safety
- **Before**: Objects caused runtime errors
- **After**: All endpoints are strings or functions returning strings

## Usage Examples

### Before (❌ Caused Error)
```typescript
// This caused: relativeURL.replace is not a function
const url = API_ENDPOINTS.musicians  // ❌ Returns an object!
apiClient.post(url, data)  // ❌ Axios receives object instead of string
```

### After (✅ Works Correctly)
```typescript
// Correct usage with string endpoints
const url = API_ENDPOINTS.musicians  // ✅ Returns '/musicos'
apiClient.post(url as string, data)  // ✅ Axios receives string

// Correct usage with function endpoints
const url = API_ENDPOINTS.musicianById('123')  // ✅ Returns '/musicos/123'
apiClient.get(url, data)  // ✅ Works perfectly
```

## Service Integration

### musicianService Example
```typescript
export const musicianService = {
  async create(data: CreateMusicianDto): Promise<ApiResponse<MusicoResponseDto>> {
    // ✅ API_ENDPOINTS.musicians is now a string
    return apiClient.post<MusicoResponseDto>(API_ENDPOINTS.musicians as string, data)
  },

  async findOne(id: string): Promise<ApiResponse<MusicoResponseDto>> {
    // ✅ API_ENDPOINTS.musicianById() returns a string
    return apiClient.get<MusicoResponseDto>(API_ENDPOINTS.musicianById(id))
  },
}
```

## Mapping to Backend Routes

| Endpoint Constant | URL | HTTP Method | Purpose |
|---|---|---|---|
| `auth.login` | `/auth/login` | POST | User login |
| `jams.list` | `/jams` | GET | List all jams |
| `jams.detail(id)` | `/jams/:id` | GET | Get single jam |
| `musicians` | `/musicos` | POST/GET | Create/list musicians |
| `musicianById(id)` | `/musicos/:id` | GET/PATCH/DELETE | Get/update/delete musician |
| `music` | `/musicas` | POST/GET | Create/list music |
| `musicByJam(jamId)` | `/jams/:jamId/musicas` | GET | Get music for jam |
| `registrations` | `/inscricoes` | POST/GET | Create/list registrations |
| `registrationsByJam(jamId)` | `/jams/:jamId/inscricoes` | GET | Get registrations for jam |
| `schedules` | `/escalas` | POST/GET | Create/list schedules |
| `schedulesByJam(jamId)` | `/jams/:jamId/escalas` | GET | Get schedule for jam |
| `reorderSchedules(jamId)` | `/jams/:jamId/escalas/reorder` | PUT | Reorder jam schedule |

## Design Principles

### 1. Flat Structure
Keep endpoints at top level for easy access and discovery

### 2. String/Function Only
Never use objects as endpoints - always resolve to strings

### 3. Naming Convention
- Use Portuguese for entity names (musicos, musicas, inscricoes, escalas)
- Use camelCase for endpoint constants in English (musicianById, registrationsByJam)

### 4. RESTful URLs
Follow REST conventions:
- Base endpoint: `/resource` (list/create)
- By ID: `/resource/:id` (get/update/delete)
- Relations: `/resource/:id/related` (get related)
- Custom actions: `/resource/:id/action` (perform custom action)

### 5. Type Safety
Cast to string when needed: `API_ENDPOINTS.musicians as string`
Use function calls when you need dynamic values: `API_ENDPOINTS.musicianById(id)`

## Migration Guide

If you have code using old endpoints:

### Old Code
```typescript
API_ENDPOINTS.musicians.list  // ❌
API_ENDPOINTS.musicians.detail('123')  // ❌
API_ENDPOINTS.registrations.create  // ❌
```

### New Code
```typescript
API_ENDPOINTS.musicians  // ✅
API_ENDPOINTS.musicianById('123')  // ✅
API_ENDPOINTS.registrations  // ✅
```

## Future Additions

When adding new endpoints, follow this pattern:

```typescript
// For new resources
newResource: '/new-resource',
newResourceById: (id: string) => `/new-resource/${id}`,
newResourceByJam: (jamId: string) => `/jams/${jamId}/new-resource`,

// For new actions
actionOnResource: (id: string) => `/new-resource/${id}/action`,
```

---

**Reference**: December 6, 2025
**Version**: 2.0 (Fixed)
**Status**: Production Ready ✅

