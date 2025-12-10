/**
 * Schedule Enrollment Modal Component
 * Modal for musicians to enroll into a specific schedule
 */

import type {ScheduleResponseDto} from '../../types/api.types'
import {registrationService} from '../../services/registrationService'
import {useAuth} from '../../hooks'
import {useState} from 'react'

interface ScheduleEnrollmentModalProps {
  schedule: ScheduleResponseDto
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

interface InstrumentOption {
    key: string
    label: string
    emoji: string
    needed: number
    registered: number
}

export function ScheduleEnrollmentModal({
                                            schedule, isOpen, onClose, onSuccess,
                                        }: ScheduleEnrollmentModalProps) {
    const { user } = useAuth()
    const [selectedInstrument, setSelectedInstrument] = useState('')
    const [enrollLoading, setEnrollLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const getInstrumentOptions = (): InstrumentOption[] => {
        if (!schedule.music) return []

        const options: InstrumentOption[] = []
        const instrumentMap = [{
            key: 'drums',
            label: 'Drums',
            emoji: '🥁',
            field: 'neededDrums' as const
        }, {key: 'guitars', label: 'Guitars', emoji: '🎸', field: 'neededGuitars' as const}, {
            key: 'vocals',
            label: 'Vocals',
            emoji: '🎤',
            field: 'neededVocals' as const
        }, {key: 'bass', label: 'Bass', emoji: '🎸', field: 'neededBass' as const}, {
            key: 'keys',
            label: 'Keys',
            emoji: '🎹',
            field: 'neededKeys' as const
        },]

        instrumentMap.forEach(({key, label, emoji, field}) => {
            const needed = schedule.music![field] || 0
            if (needed > 0) {
                const registered = schedule.registrations?.filter((reg) => reg.musician?.instrument === label).length || 0
                options.push({
                    key, label, emoji, needed, registered,
                })
            }
        })

        return options
    }

  const handleEnroll = async () => {
    if (!selectedInstrument) {
      setError('Please select an instrument')
      return
    }

    if (!user?.id) {
      setError('User ID not found. Please login again.')
      return
    }

    setEnrollLoading(true)
    setError(null)

    try {
      await registrationService.create({
        musicianId: user.id,
        scheduleId: schedule.id,
        instrument: selectedInstrument,
      } as any)

      onClose()
      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to enroll')
    } finally {
      setEnrollLoading(false)
    }
  }

    if (!isOpen) return null

    const instrumentOptions = getInstrumentOptions()

    return (<div className="modal modal-open">
            <div className="modal-box max-w-sm">
                <h3 className="font-bold text-lg mb-4">🎵 Enroll in Performance</h3>

                {/* Schedule Details */}
                <div className="bg-base-200 rounded p-3 mb-4">
                    <p className="font-semibold text-sm truncate">{schedule.music?.title || 'Song TBA'}</p>
                    <p className="text-xs text-base-content/70 truncate">
                        by {schedule.music?.artist || 'Artist TBA'}
                    </p>
                    {schedule.music?.duration && (<p className="text-xs text-base-content/60 mt-1">
                            ⏱️ {Math.floor(schedule.music.duration / 60)}:
                            {String(schedule.music.duration % 60).padStart(2, '0')}
                        </p>)}
                </div>

                {/* Error Alert */}
                {error && (<div className="alert alert-error mb-4">
                        <p>{error}</p>
                    </div>)}

                {/* Instrument Selection */}
                <div className="form-control mb-4">
                    <label className="label">
                        <span className="label-text">Select Your Instrument *</span>
                    </label>
                    <select
                        value={selectedInstrument}
                        onChange={(e) => setSelectedInstrument(e.target.value)}
                        className="select select-bordered"
                        disabled={enrollLoading}
                    >
                        <option value="">Choose an instrument...</option>
                        {instrumentOptions.map((option) => {
                            const remaining = option.needed - option.registered
                            const isFull = remaining <= 0
                            return (<option key={option.key} value={option.label} disabled={isFull}>
                                    {option.emoji} {option.label} {isFull ? '(Full)' : `(${remaining} needed)`}
                                </option>)
                        })}
                    </select>
                </div>

                {/* Instruments Summary */}
                <div className="text-sm text-base-content/70 mb-4 p-3 bg-base-200 rounded">
                    <p className="font-semibold mb-2 text-xs">Instruments Needed:</p>
                    <div className="flex flex-wrap gap-2">
                        {instrumentOptions.map((option) => {
                            const remaining = option.needed - option.registered
                            return (<span
                                    key={option.key}
                                    className={`badge badge-sm ${remaining > 0 ? 'badge-warning' : 'badge-error'}`}
                                >
                  {option.emoji} {option.label}: {remaining > 0 ? `${remaining} left` : 'Full'}
                </span>)
                        })}
                    </div>
                </div>

                {/* Modal Actions */}
                <div className="modal-action">
                    <button
                        onClick={onClose}
                        className="btn btn-ghost"
                        disabled={enrollLoading}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleEnroll}
                        className="btn btn-primary"
                        disabled={enrollLoading || !selectedInstrument}
                    >
                        {enrollLoading ? (<>
                                <span className="loading loading-spinner loading-sm"></span>
                                Enrolling...
                            </>) : ('Enroll Now')}
                    </button>
                </div>
            </div>
            <div className="modal-backdrop" onClick={onClose}></div>
        </div>)
}

