/**
 * Route Guard Hooks
 * Hooks for checking and enforcing role-based access
 */

import { useAuth } from '../../hooks'
import type { UserRole } from '../../types/auth.types'

/**
 * Checks if user has required role
 * @param userRole - Current user role
 * @param requiredRole - Single role or array of roles
 * @returns true if user has required role
 */
function hasRequiredRole(userRole: UserRole, requiredRole?: UserRole | UserRole[]): boolean {
  if (!requiredRole) return true // No role required

  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(userRole)
  }

  return userRole === requiredRole
}

/**
 * Hook to check if user can access a route
 * @param requiredRole - Single role or array of roles
 * @returns true if user can access
 */
export function useCanAccess(requiredRole?: UserRole | UserRole[]): boolean {
  const { role } = useAuth()
  return hasRequiredRole(role, requiredRole)
}

/**
 * Hook to check if user is host
 * @returns true if user is host
 */
export function useIsHost(): boolean {
  return useCanAccess('host')
}

/**
 * Hook to check if user is authenticated
 * @returns true if user is user or host
 */
export function useIsAuthenticated(): boolean {
  return useCanAccess(['user', 'host'])
}

/**
 * Hook to check if user is viewer
 * @returns true if user is viewer
 */
export function useIsViewer(): boolean {
  return useCanAccess('viewer')
}

/**
 * Hook to redirect if unauthorized
 * @param requiredRole - Single role or array of roles
 * @param redirectPath - Path to redirect to if unauthorized
 */
export function useRequireRole(requiredRole?: UserRole | UserRole[], redirectPath: string = '/'): void {
  const { role } = useAuth()
  const isAuthorized = hasRequiredRole(role, requiredRole)

  if (!isAuthorized) {
    // Use navigate-like behavior
    const url = new URL(redirectPath, window.location.origin)
    window.location.replace(url.toString())
  }
}

