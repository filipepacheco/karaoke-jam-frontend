 /**
 * Schedule Hook
 * Custom hook for fetching schedule data
 */

import { useQuery, type UseQueryResult } from './useQuery'
import { scheduleService } from '../services'
import type { ScheduleResponseDto } from '../types/api.types'

/**
 * Fetch schedules for a specific jam
 * @param jamId - Jam ID (will skip fetch if empty)
 * @returns Query result with schedule array
 */
export function useScheduleByJam(jamId: string): UseQueryResult<ScheduleResponseDto[]> {
  return useQuery(
    () => {
      if (!jamId || jamId.trim() === '') {
        return Promise.resolve([])
      }
      return scheduleService.findByJam(jamId).then((res) => res.data ?? [])
    },
    [jamId]
  )
}

/**
 * Fetch schedules for a specific musician
 * @param musicianId - Musician ID (will skip fetch if empty)
 * @returns Query result with schedule array
 */
export function useScheduleByMusician(musicianId: string): UseQueryResult<ScheduleResponseDto[]> {
  return useQuery(
    () => {
      if (!musicianId || musicianId.trim() === '') {
        return Promise.resolve([])
      }
      return scheduleService.findByMusician(musicianId).then((res) => res.data ?? [])
    },
    [musicianId]
  )
}

