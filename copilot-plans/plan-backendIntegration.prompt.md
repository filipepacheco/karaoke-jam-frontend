## Plan: Backend API Integration Module

This plan outlines the steps to build a comprehensive HTTP API integration layer connecting the React frontend with the NestJS backend. The module will use TypeScript for type safety, Axios for HTTP requests, localStorage for authentication, useState for state management, and standardized response handling. Real-time Socket.IO features will be added in a future phase.

### Steps

1. **Analyze Swagger Specifications** - Review [.github/swagger.json](.github/swagger.json) to understand all REST endpoints and their request/response schemas. Map five main resources: Jams (`/jams`), Musicians (`/musicos`), Music (`/musicas`), Registrations (`/inscricoes`), and Schedules (`/escalas`). Document all DTOs and their field types.

2. **Create TypeScript Type Definitions** - Build `src/types/api.types.ts` with interfaces matching Swagger schemas:
   - Response DTOs: `JamResponseDto`, `MusicoResponseDto`, `MusicaResponseDto`, `InscricaoResponseDto`, `EscalaResponseDto`
   - Request DTOs: `CreateJamDto`, `UpdateJamDto`, `CreateMusicianDto`, `CreateMusicDto`, `CreateRegistrationDto`, `CreateScheduleDto`
   - Standardized wrapper: `ApiResponse<T>` interface with `{ data: T, success: boolean, message?: string, error?: string }`
   - Enums: Status types from Swagger (ACTIVE, INACTIVE, FINISHED for Jams)

3. **Setup API Client with Axios** - Create `src/lib/api/client.ts` with Axios instance:
   - Configure base URL from environment variable
   - Add request interceptor to inject `Authorization: Bearer ${token}` header from localStorage
   - Add response interceptor to transform all responses into standardized `ApiResponse<T>` format
   - Implement error handler that catches network errors and transforms them to consistent error objects
   - Export typed methods: `get<T>()`, `post<T>()`, `patch<T>()`, `put<T>()`, `delete<T>()`

4. **Configure API Endpoints** - Create `src/lib/api/config.ts` with:
   - `API_CONFIG.baseURL` reading from `import.meta.env.VITE_API_URL`
   - `API_ENDPOINTS` object with all endpoint paths as constants (e.g., `jams: '/jams'`, `jamById: (id) => `/jams/${id}``)
   - Environment validation helper to ensure required env vars are set
   - Export endpoint builder functions for parameterized routes

5. **Build Service Layer** - Create service modules in `src/services/` that encapsulate API calls:
   - `jamService.ts` - create, findAll, findOne, update, remove (maps to Swagger JamController operations)
   - `musicianService.ts` - create, findAll, findOne, update, remove (maps to MusicoController)
   - `musicService.ts` - create, findAll, findOne, update, remove, findByJam, linkToJam (MusicaController)
   - `registrationService.ts` - create, findByJam, findByMusico, remove (InscricaoController)
   - `scheduleService.ts` - create, findByJam, findByMusico, update, remove, reorder (EscalaController)
   - Each method returns standardized `Promise<ApiResponse<T>>`

6. **Create React Custom Hooks** - Build hooks in `src/hooks/` using useState/useEffect:
   - `useJam(id)` - Fetch single jam, return `{ data, loading, error, refetch }`
   - `useJams()` - Fetch all jams, return `{ data, loading, error, refetch }`
   - `useMusician(id)` - Fetch musician data
   - `useMusicByJam(jamId)` - Fetch music for a specific jam
   - `useRegistrations(jamId)` - Fetch registrations for a jam
   - `useSchedule(jamId)` - Fetch schedules for a jam
   - Each hook manages loading state, error state, and provides manual refetch function

7. **Implement Error Handling** - Create `src/lib/api/errorHandler.ts` with:
   - `handleApiError(error)` function that maps error codes to user-friendly messages
   - Error display component `<ErrorAlert>` using daisyUI alert classes
   - Success notification component `<SuccessAlert>` for mutation confirmations
   - Export error utility functions for common error scenarios

8. **Setup Environment Configuration** - Create environment files and documentation:
   - Create `.env` with `VITE_API_URL=http://localhost:3000`
   - Create `.env.example` template for other developers
   - Create `.env.production` placeholder for deployment
   - Add environment setup section to [README-HOMEPAGE.md](README-HOMEPAGE.md)
   - Add `.env` to `.gitignore` (verify it's already there)

9. **Create Authentication Utilities** - Build `src/lib/auth/authStorage.ts` with:
   - `setToken(token)` - Store JWT in localStorage
   - `getToken()` - Retrieve token from localStorage
   - `removeToken()` - Clear token on logout
   - `isAuthenticated()` - Check if valid token exists
   - Simple token utilities (no validation logic yet, just storage/retrieval)

10. **Document API Integration** - Create `docs/API-INTEGRATION.md` with:
    - Service usage examples for each module
    - Hook usage patterns with code samples
    - Error handling best practices
    - Environment configuration guide
    - Common integration patterns (create jam, register musician, etc.)

### Further Considerations

1. **Error Message Localization** - Should error messages be prepared for internationalization (i18n) from the start, or implement in English only for MVP? **Recommendation**: English only for MVP, structure messages in a way that's easy to extract later.

2. **Loading UI Patterns** - Use skeleton loaders, spinners, or progress bars for loading states? **Recommendation**: Start with simple spinners using daisyUI `loading` class, add skeletons for complex layouts later.

3. **Request Cancellation** - Should we implement AbortController to cancel pending requests when components unmount? **Recommendation**: Yes, add cleanup in useEffect to prevent memory leaks and race conditions.

4. **Token Refresh Strategy** - Plan for token expiration handling? **Recommendation**: For MVP, redirect to login on 401. Add refresh token logic in future iteration.

5. **API Response Caching** - Cache GET responses in memory to avoid redundant requests during same session? **Recommendation**: No caching for MVP (keep it simple), consider adding lightweight cache later if performance issues arise.

6. **Validation Before API Calls** - Client-side validation before sending requests to reduce server load? **Recommendation**: Yes, add basic validation (required fields, data types) in service layer before API calls.

