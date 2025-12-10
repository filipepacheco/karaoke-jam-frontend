/**
 * Components Module Exports
 * Central export point for all components
 */

export { ErrorAlert } from './ErrorAlert'
export { SuccessAlert } from './SuccessAlert'
export { WarningAlert } from './WarningAlert'
export { InfoAlert } from './InfoAlert'

export {
  ProtectedRoute,
  HostOnly,
  UserOnly,
  AuthenticatedOnly,
  ViewerOnly,
} from './RouteGuards'

// Phase 4: Components
export { JamContextDisplay } from './JamContextDisplay'
export { JamCard } from './JamCard'

// Music Components
export { MusicTableRow, MusiciansBadges } from './MusicTable'
export { MusicFilters } from './MusicFilters'
export { MusicModalFormFields } from './MusicModalFormFields'
export { MusicEmptyState } from './MusicEmptyState'

// Schedule Components
export {
  ScheduleCard,
  ScheduleStatusBadge,
  ScheduleActionButtons,
  SongInfo,
  RegistrationList,
  NeededMusiciansDisplay,
  ScheduleDisplayItem,
  ScheduleEnrollmentModal,
} from './schedule'
export { SimpleLoginForm } from './forms/SimpleLoginForm'
export { SupabaseLoginForm } from './forms/SupabaseLoginForm'
export { JamRegistrationForm } from './forms/JamRegistrationForm'
export { OnboardingModal } from './OnboardingModal'
export { ProfileSetupModal } from './ProfileSetupModal'

