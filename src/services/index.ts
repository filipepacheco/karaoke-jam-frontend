/**
 * Services Module Exports
 * Central export point for all service functions
 */

export { loginOrRegister, logout } from './authService'
export {
  syncSupabaseUserToBackend,
  updateMusicianProfile,
  logoutFromBackend,
  type BackendSyncResponse,
  type SyncResult,
} from './backendAuthService'

export * as jamService from './jamService'
export * as musicianService from './musicianService'
export * as musicService from './musicService'
export * as registrationService from './registrationService'
export * as scheduleService from './scheduleService'

export type { JamDetails } from './jamService'

