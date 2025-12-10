/**
 * Error Handler
 * Maps API errors to user-friendly messages and provides error utilities
 */

import type { ApiError } from '../../types/api.types'

/**
 * Map of HTTP status codes to user-friendly messages
 */
const ERROR_MESSAGES: Record<number, string> = {
  400: 'Invalid request. Please check your input and try again.',
  401: 'You are not authenticated. Please log in.',
  403: 'You do not have permission to perform this action.',
  404: 'The requested resource was not found.',
  409: 'This action conflicts with existing data.',
  422: 'The provided data is invalid.',
  429: 'Too many requests. Please try again later.',
  500: 'A server error occurred. Please try again later.',
  502: 'Service temporarily unavailable. Please try again.',
  503: 'Service unavailable. Please try again later.',
}

/**
 * Map of common error types to messages
 */
const ERROR_TYPE_MESSAGES: Record<string, string> = {
  NETWORK_ERROR: 'Network error. Please check your internet connection.',
  TIMEOUT_ERROR: 'Request timed out. Please try again.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNAUTHORIZED: 'You need to log in to continue.',
  FORBIDDEN: 'You do not have permission for this action.',
  NOT_FOUND: 'The requested item was not found.',
  CONFLICT: 'This action conflicts with existing data.',
  SERVER_ERROR: 'A server error occurred. Please try again.',
}

/**
 * Handle API error and return user-friendly message
 * @param error - API error object
 * @returns User-friendly error message
 */
export function handleApiError(error: ApiError): string {
  // If error already has a user-friendly message, use it
  if (error.message && !error.message.startsWith('Request failed')) {
    return error.message
  }

  // Try to get message from status code
  if (error.statusCode && ERROR_MESSAGES[error.statusCode]) {
    return ERROR_MESSAGES[error.statusCode]
  }

  // Try to get message from error type
  if (error.error && ERROR_TYPE_MESSAGES[error.error]) {
    return ERROR_TYPE_MESSAGES[error.error]
  }

  // Fallback to generic message
  return 'An unexpected error occurred. Please try again.'
}

/**
 * Check if error is network-related
 * @param error - API error object
 * @returns True if network error
 */
export function isNetworkError(error: ApiError): boolean {
  return error.statusCode === 0 || error.error === 'NETWORK_ERROR'
}

/**
 * Check if error is authentication-related
 * @param error - API error object
 * @returns True if auth error
 */
export function isAuthError(error: ApiError): boolean {
  return error.statusCode === 401 || error.error === 'UNAUTHORIZED'
}

/**
 * Check if error is permission-related
 * @param error - API error object
 * @returns True if permission error
 */
export function isPermissionError(error: ApiError): boolean {
  return error.statusCode === 403 || error.error === 'FORBIDDEN'
}

/**
 * Check if error is validation-related
 * @param error - API error object
 * @returns True if validation error
 */
export function isValidationError(error: ApiError): boolean {
  return (
    error.statusCode === 400 ||
    error.statusCode === 422 ||
    error.error === 'VALIDATION_ERROR'
  )
}

/**
 * Check if error is not-found related
 * @param error - API error object
 * @returns True if not found error
 */
export function isNotFoundError(error: ApiError): boolean {
  return error.statusCode === 404 || error.error === 'NOT_FOUND'
}

/**
 * Check if error is server-related
 * @param error - API error object
 * @returns True if server error
 */
export function isServerError(error: ApiError): boolean {
  return (
    (error.statusCode >= 500 && error.statusCode < 600) ||
    error.error === 'SERVER_ERROR'
  )
}

/**
 * Get error details for logging
 * @param error - API error object
 * @returns Formatted error details
 */
export function getErrorDetails(error: ApiError): string {
  const details = []

  if (error.statusCode) {
    details.push(`Status: ${error.statusCode}`)
  }

  if (error.error) {
    details.push(`Type: ${error.error}`)
  }

  if (error.message) {
    details.push(`Message: ${error.message}`)
  }

  if (error.details) {
    details.push(`Details: ${JSON.stringify(error.details)}`)
  }

  return details.join(' | ')
}

/**
 * Format error for user display
 * @param error - Error object (can be ApiError or generic Error)
 * @returns User-friendly error message
 */
export function formatError(error: unknown): string {
  // If it's an ApiError
  if (typeof error === 'object' && error !== null && 'statusCode' in error) {
    return handleApiError(error as ApiError)
  }

  // If it's a generic Error
  if (error instanceof Error) {
    return error.message || 'An unexpected error occurred.'
  }

  // If it's a string
  if (typeof error === 'string') {
    return error
  }

  // Unknown error type
  return 'An unexpected error occurred. Please try again.'
}

