/**
 * Jam Registration Form Component
 * Form for registering to a jam with specialty and level selection
 */

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ErrorAlert, SuccessAlert } from '../index'
import type { JamDetails } from '../../services'

export const MUSIC_LEVELS = ['beginner', 'intermediate', 'advanced', 'professional'] as const

interface JamRegistrationFormProps {
  jam: JamDetails
  onSubmit?: (specialty: string, level: string) => Promise<void>
  defaultSpecialty?: string | null
}

export function JamRegistrationForm({
  jam,
  onSubmit,
  defaultSpecialty,
}: JamRegistrationFormProps) {
  const navigate = useNavigate()
  const [specialty, setSpecialty] = useState<string>(defaultSpecialty || '')
  const [level, setLevel] = useState<string>('')
  const [agreeToTerms, setAgreeToTerms] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // Get available specialties
  const availableSpecialties = jam.specialtySlots
    ? jam.specialtySlots.filter((s) => s.required > s.registered)
    : []

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validation
    if (!specialty) {
      setError('Please select a specialty/instrument')
      return
    }

    if (!agreeToTerms) {
      setError('You must agree to the terms before registering')
      return
    }

    setIsLoading(true)

    try {
      if (onSubmit) {
        await onSubmit(specialty, level)
      }
      setSuccess(true)

      // Show success for 2 seconds then redirect
      setTimeout(() => {
        navigate(`/jams/${jam.id}/my-status`)
      }, 2000)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Registration failed. Please try again.'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="card bg-base-200">
        <div className="card-body">
          <SuccessAlert
            message="Your registration is pending host approval"
            title="Registration Successful!"
          />
          <p className="text-sm text-base-content/70 mt-4">Redirecting...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card bg-base-200">
      <div className="card-body">
        <h2 className="card-title text-lg mb-4">🎭 Register for This Jam</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Specialty Selection */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Specialty/Instrument *</span>
            </label>
            {availableSpecialties.length > 0 ? (
              <select
                className="select select-bordered"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                disabled={isLoading}
              >
                <option value="">Choose a specialty...</option>
                {availableSpecialties.map((slot) => (
                  <option key={slot.specialty} value={slot.specialty}>
                    {slot.specialty} ({Math.max(0, slot.required - slot.registered)} slots available)
                  </option>
                ))}
              </select>
            ) : (
              <div className="alert alert-warning">
                <span>No specialties available at the moment</span>
              </div>
            )}
          </div>

          {/* Level Selection */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Experience Level</span>
              <span className="label-text-alt text-xs text-base-content/60">Optional</span>
            </label>
            <select
              className="select select-bordered"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              disabled={isLoading}
            >
              <option value="">Select a level...</option>
              {MUSIC_LEVELS.map((lv) => (
                <option key={lv} value={lv}>
                  {lv.charAt(0).toUpperCase() + lv.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Agreement Checkbox */}
          <div className="form-control">
            <label className="label cursor-pointer">
              <input
                type="checkbox"
                className="checkbox checkbox-sm"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                disabled={isLoading}
              />
              <span className="label-text ml-3 text-sm">
                I understand my registration is pending host approval
              </span>
            </label>
          </div>

          {/* Error Alert */}
          {error && (
            <ErrorAlert message={error} title="Registration Error" />
          )}

          {/* Buttons */}
          <div className="flex gap-2 mt-6">
            <button
              type="button"
              className="btn btn-ghost flex-1"
              onClick={() => navigate(`/jams/${jam.id}`)}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`btn btn-primary flex-1 ${isLoading ? 'loading' : ''}`}
              disabled={isLoading || !specialty || !agreeToTerms || availableSpecialties.length === 0}
            >
              {isLoading ? 'Registering...' : 'Join This Jam'}
            </button>
          </div>

          {/* Info */}
          <p className="text-xs text-base-content/60 text-center mt-4">
            You can manage your registrations from your dashboard
          </p>
        </form>
      </div>
    </div>
  )
}

export default JamRegistrationForm

