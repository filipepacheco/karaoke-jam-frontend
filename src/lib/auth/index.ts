/**
 * Authentication Utilities Index
 * Central export point for authentication utilities
 */

export { setToken, getToken, removeToken, isAuthenticated, clearAuth } from './authStorage'

export {
  hasPermission,
  hasRequiredRole,
  canAccess,
  getDefaultRedirectByRole,
  getRoleLabel,
  isResourceOwner,
  canEditJam,
  canDeleteJam,
  canManageRegistrations,
  canViewOwnRegistrations,
  canRegisterForJam,
  canCreateJam,
  canViewJamDetails,
  canViewMusicians,
  canViewMusic,
  canViewDashboard,
} from './roleUtils'

