/**
 * Onboarding Modal Component
 * Shows after first social login to collect instrument & genre preferences
 */

import {useState} from 'react'
import {useAuth} from '../hooks'
import {INSTRUMENTS} from '../lib/instruments'
import {GENRES} from '../lib/musicConstants'

interface OnboardingModalProps {
  isOpen: boolean
  onClose: () => void
}

export function OnboardingModal({ isOpen, onClose }: OnboardingModalProps) {
  const { user, completeOnboarding, clearNewUserFlag } = useAuth()
  const [instrument, setInstrument] = useState('')
  const [genre, setGenre] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!instrument || !genre) {
      setError('Please select both an instrument and a genre')
      return
    }

    setIsLoading(true)

    try {
      const result = await completeOnboarding(instrument, genre)

      if (result.success) {
        onClose()
      } else {
        setError(result.error || 'Failed to save preferences')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSkip = () => {
    clearNewUserFlag()
    onClose()
  }

  if (!isOpen) return null

  return (
    <dialog className="modal modal-open">
      <div className="modal-box">
        {/* Header */}
        <h3 className="font-bold text-lg mb-2">
          🎉 Welcome to Jam Session{user?.name ? `, ${user.name}` : ''}!
        </h3>
        <p className="text-base-content/70 mb-6">
          Tell us a bit about yourself so we can match you with the right jams.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Instrument Selection */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">What's your main instrument?</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={instrument}
              onChange={(e) => setInstrument(e.target.value)}
              disabled={isLoading}
            >
              <option value="">Select an instrument...</option>
              {INSTRUMENTS.map((inst) => (
                <option key={inst} value={inst}>
                  {inst}
                </option>
              ))}
            </select>
          </div>

          {/* Genre Selection */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">What's your favorite genre?</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              disabled={isLoading}
            >
              <option value="">Select a genre...</option>
              {GENRES.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="alert alert-error">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Actions */}
          <div className="modal-action">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={handleSkip}
              disabled={isLoading}
            >
              Skip for now
            </button>
            <button
              type="submit"
              className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
              disabled={isLoading || !instrument || !genre}
            >
              {isLoading ? 'Saving...' : 'Get Started'}
            </button>
          </div>
        </form>
      </div>

      {/* Backdrop - clicking dismisses modal */}
      <form method="dialog" className="modal-backdrop">
        <button onClick={handleSkip}>close</button>
      </form>
    </dialog>
  )
}

export default OnboardingModal

