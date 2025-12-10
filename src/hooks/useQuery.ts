/**
 * Base Hook for Data Fetching
 * Generic hook for fetching data with loading/error states
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import type { ApiError } from '../types/api.types'

/**
 * Generic query result type
 */
export interface UseQueryResult<T> {
  data: T | null
  loading: boolean
  error: string | null
  refetch: () => void
}

/**
 * Generic hook for fetching data
 * @param fetchFn - Async function that fetches data
 * @param dependencies - Dependency array for useEffect
 * @returns Query result with data, loading, error, and refetch
 */
export function useQuery<T>(
  fetchFn: () => Promise<T>,
  dependencies: unknown[] = []
): UseQueryResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Use ref to store the latest fetchFn without causing re-renders
  const fetchFnRef = useRef(fetchFn)

  // Update ref when fetchFn changes
  useEffect(() => {
    fetchFnRef.current = fetchFn
  }, [fetchFn])

  const fetch = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await fetchFnRef.current()
      setData(result)
      setError(null)
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message || 'An error occurred')
      setData(null)
    } finally {
      setLoading(false)
    }
  }, []) // Empty deps - only created once

  // Create a stable key from dependencies to avoid infinite loops
  const depsKey = JSON.stringify(dependencies)

  useEffect(() => {
    fetch()
  }, [depsKey, fetch]) // Depend on stringified deps and fetch

  return {
    data,
    loading,
    error,
    refetch: fetch,
  }
}

