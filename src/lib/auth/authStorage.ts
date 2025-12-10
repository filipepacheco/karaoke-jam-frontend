/**
 * Authentication Storage Utilities
 * Handles JWT token storage and retrieval from localStorage
 */

const TOKEN_KEY = 'auth_token'

/**
 * Store authentication token in localStorage
 * @param token - JWT token to store
 */
export function setToken(token: string): void {
  if (!token || token.trim() === '') {
    console.warn('Attempted to set empty token')
    return
  }
  localStorage.setItem(TOKEN_KEY, token)
}

/**
 * Retrieve authentication token from localStorage
 * @returns JWT token or null if not found
 */
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

/**
 * Remove authentication token from localStorage
 */
export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}

/**
 * Check if user is authenticated (token exists)
 * @returns true if valid token exists, false otherwise
 */
export function isAuthenticated(): boolean {
  const token = getToken()
  return token !== null && token.trim() !== ''
}

/**
 * Clear all authentication data (for logout)
 */
export function clearAuth(): void {
  removeToken()
}

